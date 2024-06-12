import { Router } from "express";
import { body, param } from "express-validator";

import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";

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
router.get(
   "/:id",
   param("id").isMongoId().withMessage("Id not valid"),
   handleInputErrors,
   ProjectController.getProjectById
);

router.put(
   "/:id",
   param("id").isMongoId().withMessage("Id not valid"),
   body("projectName").notEmpty().withMessage("Project Name is required"),
   body("clientName").notEmpty().withMessage("Client Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
   handleInputErrors,
   ProjectController.updateProject
);

router.delete("/:id",
   param("id").isMongoId().withMessage("Id not valid"),
   handleInputErrors,
   ProjectController.deleteProject
)

router.post('/:projectId/tasks', 
   projectExists,
   body("name").notEmpty().withMessage("Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
   handleInputErrors,
   TaskController.createTask
)

router.get('/:projectId/tasks',
   projectExists, 
   TaskController.getTasksByProjectId
)

router.get('/:projectId/tasks/:taskId',
   projectExists,
   param("taskId").isMongoId().withMessage("Id not valid"),
   handleInputErrors, 
   TaskController.getTasksById
)

export default router;
