import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import templateService from '../../features/evaluations/services/template-service';
import dimensionsService from '../../features/evaluations/services/dimensions-service';
import type { Dimension } from '../../features/evaluations/types/dimension.types';
import { EvaluationMilestone, TargetRole, QuestionType } from '../../features/evaluations/types/template.types';

interface QuestionFormData {
  id?: string;
  text: string;
  dimensionId: string;
  type: QuestionType;
  order: number;
  required: boolean;
}

interface TemplateFormData {
  title: string;
  description: string;
  milestone: EvaluationMilestone;
  targetRole: TargetRole;
  isActive: boolean;
  questions: QuestionFormData[];
}

const TemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'nueva';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);

  const { register, control, handleSubmit, reset } = useForm<TemplateFormData>({
    defaultValues: {
      title: '',
      description: '',
      milestone: EvaluationMilestone.DAY_1,
      targetRole: TargetRole.COLLABORATOR,
      isActive: true,
      questions: []
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions'
  });


  // Load dimensions from backend
  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const data = await dimensionsService.getAll();
        // Filter only active dimensions
        const activeDimensions = data.filter(d => d.isActive).sort((a, b) => a.order - b.order);
        setDimensions(activeDimensions);
      } catch (error) {
        console.error('Error fetching dimensions:', error);
        toast.error('Error al cargar las dimensiones');
      }
    };
    fetchDimensions();
  }, []);

  useEffect(() => {
    if (!isNew && id) {
      const fetchTemplate = async () => {
        try {
          const template = await templateService.getById(id);
          reset({
            title: template.title,
            description: template.description || '',
            milestone: template.milestone,
            targetRole: template.targetRole,
            isActive: template.isActive,
            questions: template.questions.sort((a, b) => a.order - b.order).map(q => ({
              id: q.id,
              text: q.text,
              dimensionId: q.dimensionId,
              type: q.type,
              order: q.order,
              required: q.required
            }))
          });
        } catch (error) {
          console.error('Error fetching template:', error);
          toast.error('Error al cargar la plantilla');
          navigate('/evaluaciones/plantillas');
        } finally {
          setLoading(false);
        }
      };
      fetchTemplate();
    }
  }, [id, isNew, navigate, reset]);

  const onSubmit = async (data: TemplateFormData) => {
    try {
      setSaving(true);
      // Ensure order is correct
      const questionsWithOrder = data.questions.map((q, index) => ({
        ...q,
        order: index + 1
      }));

      if (isNew) {
        await templateService.create({
          ...data,
          questions: questionsWithOrder
        });
        toast.success('Plantilla creada correctamente');
      } else if (id) {
        await templateService.update(id, {
          title: data.title,
          description: data.description,
          isActive: data.isActive,
          questions: questionsWithOrder
        });
        toast.success('Plantilla actualizada correctamente');
      }
      navigate('/evaluaciones/plantillas');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar la plantilla');
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const addQuestion = () => {
    // Use first available dimension or empty string if none available
    const defaultDimensionId = dimensions.length > 0 ? dimensions[0].id : '';
    append({
      text: '',
      dimensionId: defaultDimensionId,
      type: QuestionType.SCALE_1_4,
      order: fields.length + 1,
      required: true
    });
  };

  if (loading) return <div className="p-8 text-center">Cargando editor...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/evaluaciones/plantillas')} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Nueva Plantilla' : 'Editar Plantilla'}
            </h1>
            <p className="text-sm text-gray-500">
              {isNew ? 'Define los detalles y preguntas de la evaluación' : 'Modifica la estructura de la evaluación existente'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/evaluaciones/plantillas')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <Save size={18} className="mr-2" />
            {saving ? 'Guardando...' : 'Guardar Plantilla'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-4 sticky top-24">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Configuración General</h3>
            
            <Input
              label="Título de la Evaluación"
              {...register('title', { required: 'El título es obligatorio' })}
              placeholder="Ej: Evaluación Día 1 - Colaborador"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                {...register('description')}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                placeholder="Instrucciones o contexto para la evaluación..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hito (Milestone)</label>
                <select
                  {...register('milestone')}
                  disabled={!isNew} // Milestone shouldn't change after creation to avoid consistency issues
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value={EvaluationMilestone.DAY_1}>Día 1</option>
                  <option value={EvaluationMilestone.WEEK_1}>Semana 1</option>
                  <option value={EvaluationMilestone.MONTH_1}>Mes 1</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol Objetivo</label>
                <select
                  {...register('targetRole')}
                  disabled={!isNew}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value={TargetRole.COLLABORATOR}>Colaborador (Autoevaluación)</option>
                  <option value={TargetRole.TEAM_LEADER}>Team Leader (Evaluador)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Plantilla Activa
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Al activar esta plantilla, se desactivarán otras del mismo hito y rol.
            </p>
          </div>
        </div>

        {/* Questions Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Preguntas ({fields.length})</h3>
              <Button type="button" onClick={addQuestion} variant="secondary" size="sm">
                <Plus size={16} className="mr-1" /> Agregar Pregunta
              </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={clsx(
                              "border rounded-lg p-4 bg-white transition-shadow",
                              snapshot.isDragging ? "shadow-lg ring-2 ring-brand-primary/20" : "border-gray-200 hover:border-brand-primary/50"
                            )}
                          >
                            <div className="flex gap-3">
                              <div {...provided.dragHandleProps} className="mt-2 text-gray-400 hover:text-gray-600 cursor-move">
                                <GripVertical size={20} />
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex gap-4">
                                  <div className="flex-1">
                                    <Input
                                      {...register(`questions.${index}.text` as const, { required: true })}
                                      placeholder="Escribe la pregunta..."
                                      className="font-medium"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                    title="Eliminar pregunta"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Dimensión</label>
                                    <select
                                      {...register(`questions.${index}.dimensionId` as const, { required: true })}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary text-sm"
                                    >
                                      {dimensions.length === 0 ? (
                                        <option value="">Cargando dimensiones...</option>
                                      ) : (
                                        dimensions.map((dim) => (
                                          <option key={dim.id} value={dim.id}>
                                            {dim.name}
                                          </option>
                                        ))
                                      )}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Tipo de Respuesta</label>
                                    <select
                                      {...register(`questions.${index}.type` as const)}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary text-sm"
                                    >
                                      <option value={QuestionType.SCALE_1_4}>Escala 1 a 4</option>
                                      <option value={QuestionType.OPEN_TEXT}>Texto Abierto</option>
                                    </select>
                                  </div>

                                  <div className="flex items-center pt-6">
                                    <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        {...register(`questions.${index}.required` as const)}
                                        className="mr-2 h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                                      />
                                      Obligatoria
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
                <p>No has agregado preguntas a esta plantilla.</p>
                <Button type="button" onClick={addQuestion} variant="ghost" className="mt-2 text-brand-primary">
                  + Agregar primera pregunta
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default TemplateEditor;
