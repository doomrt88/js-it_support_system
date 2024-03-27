import mongoose, { Schema } from "mongoose";

const PermissionSchema = new Schema({
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    group_name: {
        type: String,
        required: true
    }
  });

const PermissionModel = mongoose.model("permissions", PermissionSchema);

export default PermissionModel;