# Lineamientos Backend (NestJS)

## 1. Arquitectura y Principios

### 1.1 Arquitectura Limpia

**Capas (de afuera hacia adentro):**

- Presentación (Controllers + DTOs HTTP)
- Aplicación (Casos de uso + Commands/Queries + DTOs)
- Dominio (Entidades + Repositorios - interfaces - + Excepciones)
- Infraestructura (Implementaciones: DB, APIs, SQS)

**Regla clave:**

> Las dependencias apuntan hacia adentro (Infra → App → Dominio)

### 1.2 Principios SOLID

- **S** — Una clase, una responsabilidad  
- **O** — Abierto a extensión, cerrado a modificación  
- **L** — Las clases derivadas sustituyen a sus bases  
- **I** — Interfaces específicas, no generales  
- **D** — Depender de abstracciones, no de implementaciones  

---

## 2. Estructura de Carpetas

```
src/
├── common/              // Compartido (decorators, filters, guards, pipes)
├── config/              // Configuraciones
├── core/                
│   └── memberships/
│       ├── domain/                    // Lógica de negocio pura
│       │   ├── entities/              
│       │   ├── repositories/          // Interfaces
│       │   ├── services/              
│       │   └── exceptions/            
│       ├── application/               
│       │   ├── use-cases/             
│       │   ├── commands/              // Inputs de casos de uso
│       │   ├── queries/               // Consultas
│       │   └── dto/                   
│       ├── infrastructure/            
│       │   ├── persistence/           // ORM + Repos
│       │   ├── external-services/     
│       │   └── messaging/             
│       └── presentation/              
│           ├── controllers/
│           └── dto/                   // DTOs HTTP
└── shared/
```

---

## 3. Commands y Queries (CQRS)

### ¿Qué son?

> Objetos simples que representan intenciones de negocio y transportan datos a los casos de uso.

### Ubicación

```
src/core/memberships/application/commands/
src/core/memberships/application/queries/
```

### Estructura

Ejemplo completo:

```ts
export class CreateMembershipCommand {
  constructor(
    public readonly userId: string,
    public readonly type: MembershipType,
    public readonly country: CountryCode,
  ) {}
}
```

### Flujo completo

```ts
@Post()
async create(@Body() dto: CreateMembershipRequestDto) {
  const command = dto.toCommand();  
  return await this.useCase.execute(command);
}

@Injectable()
export class CreateMembershipUseCase {
  async execute(command: CreateMembershipCommand): Promise<Result> {
    // Lógica
  }
}
```

### Tabla comparativa DTO vs Command

| Elemento | DTO | Command |
|---------|-------|-----------|
| Capa | Presentación | Aplicación |
| Propósito | Transporte HTTP | Intención de negocio |
| Validación | Técnica (formato) | Negocio |
| Reutilizable | No | Sí |

---

## 4. Entidades de Dominio

Ejemplo:

```ts
export class MembershipDomainEntity {
  private constructor(
    private readonly _id: string,
    private _status: MembershipStatus,
  ) {}

  static create(props: CreateProps): MembershipDomainEntity {
    // validaciones
  }

  activate(): void {
    if (this._status !== MembershipStatus.PENDING) {
      throw new InvalidStatusTransitionException();
    }
    this._status = MembershipStatus.ACTIVE;
  }

  get id(): string { return this._id; }
  get status(): MembershipStatus { return this._status; }
}
```

Características:

- Constructor privado  
- Factory methods  
- Lógica de negocio encapsulada  
- Solo getters, sin setters  

---

## 5. Repositorios

### Interface (Dominio)

```ts
export interface IMembershipRepository {
  findById(id: string): Promise<MembershipDomainEntity | null>;
  save(membership: MembershipDomainEntity): Promise<void>;
}
```

### Implementación (Infraestructura)

```ts
@Injectable()
export class PostgresMembershipRepository implements IMembershipRepository {
  constructor(
    @InjectRepository(MembershipOrmEntity)
    private readonly repository: Repository<MembershipOrmEntity>,
  ) {}

  async findById(id: string): Promise<MembershipDomainEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? orm.toDomain() : null;
  }
}
```

---

## 6. Casos de Uso

```ts
@Injectable()
export class CreateMembershipUseCase {
  constructor(
    @Inject('IMembershipRepository') private repo: IMembershipRepository,
    @Inject('IPaymentGateway') private payments: IPaymentGateway,
  ) {}

  async execute(command: CreateMembershipCommand): Promise<Result> {
    // Validaciones, pago, persistencia, publicar eventos...
  }
}
```

Reglas:

- Un caso de uso = una operación completa de negocio  
- Sin lógica HTTP  
- Depender de interfaces  

---

## 7. DTOs y Validación

### Request DTO

```ts
export class CreateMembershipRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(MembershipType)
  type: MembershipType;

  toCommand(): CreateMembershipCommand {
    return new CreateMembershipCommand(this.userId, this.type);
  }
}
```

### Response DTO

```ts
export class MembershipResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: MembershipStatus;

  static fromDomain(entity: MembershipDomainEntity): MembershipResponseDto {
    const dto = new MembershipResponseDto();
    dto.id = entity.id;
    dto.status = entity.status;
    return dto;
  }
}
```

---

## 8. Excepciones

```ts
export abstract class DomainException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}

export class MembershipNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Membership ${id} not found`, 'MEMBERSHIP_NOT_FOUND');
  }
}
```

Manejo en controller:

```ts
private handleError(error: Error): never {
  if (error instanceof MembershipNotFoundException) {
    throw new NotFoundException(error.message);
  }
  throw new InternalServerErrorException('Unexpected error');
}
```

---

## 9. Logging

```ts
@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  async doSomething(id: string): Promise<void> {
    this.logger.log(`Starting operation for ${id}`);
    try {
      this.logger.log(`Completed for ${id}`);
    } catch (error) {
      this.logger.error(`Failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

---

## 10. Testing

Ejemplo:

```ts
describe('CreateMembershipUseCase', () => {
  let useCase: CreateMembershipUseCase;
  let repository: jest.Mocked<IMembershipRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateMembershipUseCase,
        { provide: 'IMembershipRepository', useValue: createMock() },
      ],
    }).compile();

    useCase = module.get(CreateMembershipUseCase);
    repository = module.get('IMembershipRepository');
  });

  it('should create membership', async () => {
    const command = new CreateMembershipCommand('123', 'ANNUAL', 'CL');
    repository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
```

Cobertura mínima:
- 60% en componentes críticos  
- 100% en dominio  

---

## 11. Configuración

### 11.1 Variables de Entorno
```ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    // ...
  },
});
```

### 11.2 Configuración Global (main.ts)
Se deben establecer los siguientes estándares en el `main.ts`:

```ts
// Prefijo global para todos los endpoints
app.setGlobalPrefix('api/');

// Configuración de CORS para desarrollo local
app.enableCors({
  origin: ['http://localhost:3050'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

// Swagger en la ruta /docs
const config = new DocumentBuilder()
  .setTitle('Gestion ICER API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
SwaggerModule.setup('docs', app, document);
```

---

## 12. Seguridad

### 12.1 Librerías Base
- **Autenticación**: `@nestjs/passport`, `passport`, `passport-jwt`, `passport-local`.
- **Hashing**: `bcryptjs` (con salt rounds = 12).

### 12.2 Decoradores Personalizados
Se recomienda el uso de decoradores para extraer información del usuario autenticado desde el request.

```ts
// common/decorators/get-user.decorator.ts
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Uso en Controller
@Get('me')
getProfile(@GetUser() user: User) {
  return user;
}
```

---

## 13. Mensajería SQS

Publisher y Consumer completos, con long polling y borrado de mensajes.

---

## 14. Swagger

Anotaciones de controllers y respuestas.

---

## 15. Base de Datos y ORM

### 15.1 Configuración TypeORM
- Utilizar `typeorm-naming-strategies` para asegurar la convención `snake_case` en la base de datos (PostgreSQL).
- Las entidades deben usar decoradores estándar de TypeORM (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`).

### 15.2 Estrategia de Claves Primarias y UUIDs

**Regla clave:**
> Internamente, la base de datos debe gestionar las relaciones con claves numéricas pequeñas y eficientes (int o bigint). Cuando una referencia a datos necesita ser expuesta al exterior —incluso cuando "exterior" significa otro sistema interno—, se debe usar exclusivamente UUID.

**¿Cuándo agregar UUID a una entidad?**

El uso de UUID **NO es obligatorio para todas las entidades**. Solo debe usarse en entidades que:

1. Se exponen directamente a través de APIs públicas o internas
2. Son referenciadas en URLs, enlaces o comunicaciones externas
3. Pueden ser consultadas o manipuladas por sistemas externos
4. Representan recursos de negocio principales (no datos de catálogo)

**Entidades que SÍ requieren UUID (expuestas externamente):**
| Entidad | Justificación |
|---------|---------------|
| `Collaborator` | Entidad principal, referenciada en reportes y APIs |
| `User` | Gestión de usuarios, autenticación |
| `Evaluation` | Puede compartirse con evaluadores externos |
| `EvaluationAssignment` | Enlaces únicos para evaluadores |
| `ActionPlan` | Reportes y seguimiento externo |

**Entidades que NO requieren UUID (datos internos/catálogo):**
| Entidad | Justificación |
|---------|---------------|
| `Dimension` | Datos de catálogo, solo referenciados internamente |
| `Question` | Parte de templates, sin exposición directa |
| `EvaluationTemplate` | Configuración interna del sistema |
| `MilestoneResult` | Resultados calculados internos |
| `FollowUpPlanTemplate` | Templates de configuración |

> **Nota:** Las entidades de catálogo no deben tener UUID. Si ya existe, puede eliminarse durante una refactorización planificada.

**Implementación:**

1. **Clave primaria interna**: Usar `@PrimaryGeneratedColumn()` para generar IDs numéricos secuenciales automáticos.
2. **UUID para exposición externa**: Agregar una columna `uuid` con generación automática y constraint `UNIQUE`.
3. **Relaciones internas (FK)**: Usar las claves numéricas (`id`) para JOINs y referencias entre tablas.
4. **APIs y sistemas externos**: Exponer únicamente el `uuid`, nunca el `id` numérico interno.

```ts
// Entidad CON UUID (expuesta externamente)
@Entity('collaborators')
export class CollaboratorOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, generated: 'uuid' })
  uuid: string;

  // ... otros campos
}

// Entidad SIN UUID (datos de catálogo internos)
@Entity('dimensions')
export class DimensionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;  // Usar código legible en lugar de UUID para catálogos

  // ... otros campos
}

// FK usando id numérico de otra entidad
@Entity('evaluations')
export class EvaluationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, generated: 'uuid' })
  uuid: string;

  @Column({ name: 'collaborator_id', type: 'int' })
  collaboratorId: number;

  @ManyToOne(() => CollaboratorOrmEntity)
  @JoinColumn({ name: 'collaborator_id' })
  collaborator: CollaboratorOrmEntity;
}
```

**Beneficios:**
- **Rendimiento**: JOINs y búsquedas más rápidas con índices numéricos.
- **Espacio**: Claves numéricas ocupan menos espacio que UUIDs.
- **Seguridad**: Los UUIDs no revelan información sobre el orden o cantidad de registros.
- **Flexibilidad**: Permite cambiar UUIDs sin afectar relaciones internas.
- **Claridad**: No todas las entidades necesitan la complejidad adicional del UUID.

### 15.3 Mapeo entre Dominio y Persistencia

Los **Mappers** son responsables de la conversión entre entidades de dominio y entidades ORM:

**Para entidades CON UUID (expuestas externamente):**
```ts
export class CollaboratorMapper {
  static toDomain(orm: CollaboratorOrmEntity): Collaborator {
    return Collaborator.reconstitute(
      orm.uuid, // ← UUID se convierte en el ID del dominio
      orm.name,
      // ... otros campos
    );
  }

  static toOrm(domain: Collaborator): CollaboratorOrmEntity {
    const orm = new CollaboratorOrmEntity();
    orm.uuid = domain.id; // ← ID del dominio se mapea al UUID
    // uuid se genera automáticamente en la BD para nuevos registros
    // ... otros campos
    return orm;
  }
}
```

**Para entidades SIN UUID (datos internos/catálogo):**
```ts
export class DimensionMapper {
  static toDomain(orm: DimensionOrmEntity): Dimension {
    return Dimension.reconstitute(
      String(orm.id), // ← Convertir ID numérico a string
      orm.code,
      // ... otros campos
    );
  }

  static toOrm(domain: Dimension): DimensionOrmEntity {
    const orm = new DimensionOrmEntity();
    if (domain.id) {
      orm.id = Number(domain.id); // ← Convertir string a número
    }
    // ... otros campos
    return orm;
  }
}
```

**Consultas en Repositorios:**
```ts
// Para entidades CON UUID: buscar por uuid
async findById(id: string): Promise<Collaborator | null> {
  const orm = await this.repository.findOne({ where: { uuid: id } });
  return orm ? CollaboratorMapper.toDomain(orm) : null;
}

// Para entidades SIN UUID: buscar por id numérico
async findById(id: string): Promise<Dimension | null> {
  const orm = await this.repository.findOne({ where: { id: Number(id) } });
  return orm ? DimensionMapper.toDomain(orm) : null;
}

// Para FKs numéricas: convertir el ID del dominio
async findByCollaboratorId(collaboratorId: string): Promise<ActionPlan[]> {
  const orms = await this.repository.find({
    where: { collaboratorId: Number(collaboratorId) },
  });
  return orms.map(ActionPlanMapper.toDomain);
}
```

```ts
// Ejemplo de configuración en AppModule o DatabaseModule
TypeOrmModule.forRoot({
  // ...
  namingStrategy: new SnakeNamingStrategy(), // De librería typeorm-naming-strategies
});
```

---

## 16. Convenciones

Tabla completa de nombres: clases, interfaces, dto, queries, etc.

---

## 17. Checklist de Calidad

Incluye:
- SOLID  
- Commands/DTO separation  
- Logging  
- Swagger  
- TS strict  
- Guards  
- Sin console.log  

---

## 18. ❌ NO HACER

- Lógica en controller  
- Usar any  
- Pasar DTO directo al caso de uso  
- Dependencias a implementaciones concretas  

---

## 19. ✔️ SÍ HACER

- DTO → Command → UseCase  
- Depender de interfaces  
- Extraer lógica al dominio  
- Validar entradas  
- Logger estructurado  

---

## 20. Tags

`#backend` `#nestjs` `#clean-architecture` `#solid` `#typescript` `#best-practices` `#proyecto-prime`