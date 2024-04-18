import express from "express";
import CommentModel from "../models/comments.js";
import { validateToken } from "../middlewares/auth.js";

const app = express();

// Create comment
router.post("/comment", validateToken, async (req, res) => {
    const newComment = { ...req.body };
    newComment.created_at = new Date();
    newComment.created_by = req.user.id;
  
    CommentModel.create(newComment)
      .then((comment) => {
        return res.status(201).json({ message: "Comment created", comment });
      })
      .catch((error) => {
        return res.status(400).json({ error: "Database error", message: error });
      });
  });

router.get("/comment/:issue", [validateToken], async (req, res) => {
    const{issueId} = req.params;
    if(!issueId){
        return res.status(400).json({
            error: "bad request",
            message: "issue number not provided"
        });
    }
    try{
        const comments = await CommentModel.find({ issue_number: issueId}).exec();
        return res.status(200).json(comments);
    } catch(error){
        return response.status(400).json({
            error: "Error finding comments for the issues",
            message: error,
          });
    }
});