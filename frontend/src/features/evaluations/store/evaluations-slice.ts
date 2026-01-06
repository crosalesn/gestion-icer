import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import evaluationsService from '../services/evaluations-service';
import type { PendingEvaluationResponse } from '../types/template.types';

interface EvaluationsState {
  pendingEvaluations: PendingEvaluationResponse[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
}

const initialState: EvaluationsState = {
  pendingEvaluations: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
};

export const fetchPendingEvaluations = createAsyncThunk(
  'evaluations/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const data = await evaluationsService.getAllPending();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar evaluaciones pendientes');
    }
  }
);

export const submitEvaluation = createAsyncThunk(
  'evaluations/submit',
  async (
    { assignmentId, answers }: { assignmentId: string; answers: Array<{ questionId: string; value: number | string }> },
    { rejectWithValue }
  ) => {
    try {
      const data = await evaluationsService.submitAssignment(assignmentId, { answers });
      return { assignmentId, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar la evaluación');
    }
  }
);

const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
    },
    removePendingEvaluation: (state, action: PayloadAction<string>) => {
      state.pendingEvaluations = state.pendingEvaluations.filter(
        (evalItem) => evalItem.assignment.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pending evaluations
      .addCase(fetchPendingEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingEvaluations.fulfilled, (state, action: PayloadAction<PendingEvaluationResponse[]>) => {
        state.loading = false;
        state.pendingEvaluations = action.payload;
      })
      .addCase(fetchPendingEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit evaluation
      .addCase(submitEvaluation.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitEvaluation.fulfilled, (state, action) => {
        state.submitting = false;
        // Remove the submitted evaluation from pending list
        state.pendingEvaluations = state.pendingEvaluations.filter(
          (evalItem) => evalItem.assignment.id !== action.payload.assignmentId
        );
      })
      .addCase(submitEvaluation.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });
  },
});

export const { clearError, removePendingEvaluation } = evaluationsSlice.actions;
export default evaluationsSlice.reducer;

