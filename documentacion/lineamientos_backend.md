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