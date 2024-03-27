import express from 'express';
import Permission from '../models/permissions.js';
import { validateToken } from '../middlewares/auth.js';

const router = express.Router();

// Get permission by id
router.get("/permissions/:id", validateToken, (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Bad request", message: "No ID provided" });
  }

  Permission.findById(id)
    .then((permission) => {
      return res.status(200).json(permission);
    })
    .catch((error) => {
      return res.status(400).json({ error: "Error finding permission", message: error });
    });
});


router.get("/permissions", validateToken, (_, res) => {
  Permission.aggregate([
    {
      $group: {
        _id: "$group_name",
        permissions: { $push: "$$ROOT" }
      }
    },
    {
      $project: {
        _id: 0,
        group_name: "$_id",
        permissions: {
          $map: {
            input: "$permissions",
            as: "perm",
            in: {
              _id: "$$perm._id",
              name: "$$perm.name"
            }
          }
        }
      }
    },
    {
      $sort: { groupName: 1, "permissions.name": 1 } // Sort by group name and then by permission name
    }
  ])
    .then((groups) => {
      console.log('permissionssssss');
      console.log(groups);
      return res.status(200).json(groups);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error: "Error grouping permissions", message: error });
    });
});


// Create permission
router.post("/permissions", validateToken, async (req, res) => {
  const newPermission = { ...req.body };

  Permission.create(newPermission)
    .then((permission) => {
      return res.status(201).json({ message: "Permission created", permission });
    })
    .catch((error) => {
      return res.status(400).json({ error: "Database error", message: error });
    });
});

// Delete permission
router.delete("/permissions/:id", validateToken, (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Bad request", message: "No ID provided" });
  }

  Permission.findByIdAndDelete(id)
    .then((permission) => {
      if (!permission) {
        return res.status(404).json({ error: "Permission not found", message: "Permission with provided ID not found" });
      }
      return res.status(200).json({ message: "Permission deleted successfully", permission });
    })
    .catch((error) => {
      return res.status(400).json({ error: "Error deleting permission", message: error.message });
    });
});

// Update permission
router.put("/permissions/:id", validateToken, (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!id || !body) {
    return res.status(400).json({ error: "Bad request", message: "No ID or body provided" });
  }

  Permission.findByIdAndUpdate(id, body, { new: true })
    .then((permission) => {
      if (!permission) {
        return res.status(404).json({ error: "Permission not found", message: "Permission with provided ID not found" });
      }
      return res.status(200).json({ message: "Permission updated successfully", permission });
    })
    .catch((error) => {
      return res.status(400).json({ error: "Error updating permission", message: error.message });
    });
});

export default router;
