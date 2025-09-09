import { refreshTurfOwnerSession } from "@/services/TurfOwner/turfOwnerService";
import type { ITurfOwner } from "@/types/User";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TurfOwnerState {
    turfOwner:ITurfOwner |null;
}

const initialState:TurfOwnerState = {
    turfOwner:null,
}

export const refreshTurfOwnerSessionThunk = createAsyncThunk<
  { user: ITurfOwner },
  void,
  { rejectValue: string }
>("turfOwner/refreshSession", async (_, { rejectWithValue }) => {
  try {
    const { user } = await refreshTurfOwnerSession();
     if (!('_id' in user) || !user.userId) {
      return rejectWithValue('Invalid turf owner data received');
    }

    const turfOwner = user as ITurfOwner;
    const mappedTurfOwner: ITurfOwner = {
      _id: user._id,
      userId: user.userId,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ownerName: 'ownerName' in user ? user.ownerName : undefined,
      googleId: 'googleId' in user ? user.googleId : undefined,
      rejectionReason: 'rejectionReason' in user ? user.rejectionReason : undefined,
    };
    return { user: mappedTurfOwner };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});


const turfOwnerSlice = createSlice({
  name: "turfOwner",
  initialState,
  reducers: {
    turfOwnerLogin: (state, action: PayloadAction<ITurfOwner>) => {
      state.turfOwner = action.payload;
    },
    turfOwnerLogout: (state) => {
      state.turfOwner = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshTurfOwnerSessionThunk.fulfilled, (state, action) => {
      state.turfOwner = action.payload.user;
    });
  },
});

export const { turfOwnerLogin, turfOwnerLogout } = turfOwnerSlice.actions;
export default turfOwnerSlice.reducer;