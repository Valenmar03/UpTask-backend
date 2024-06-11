import { Router } from "express";
import { body, param } from "express-validator";

import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
   "/",
   body("projectName").notEmpty().withMessage("Project Name is required"),
   body("clientName").notEmpty().withMessage("Client Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
   handleInputErrors,
   ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);
router.get("/:id", 
    param('id').isMongoId().withMessage('Id not valid'),
    handleInputErrors,
    ProjectController.getProjectById
);

export default router;
