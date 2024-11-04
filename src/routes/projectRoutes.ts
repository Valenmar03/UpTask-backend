import { Router } from "express";
import { body, param } from "express-validator";

import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate)

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


router.param('projectId', projectExists) // Ejecuta projectExists en todas los endpoints que tengan "/:projectId" como param

router.post('/:projectId/tasks', 
   body("name").notEmpty().withMessage("Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
   handleInputErrors,
   TaskController.createTask
)

router.get('/:projectId/tasks',
   TaskController.getTasksByProjectId
)

router.param('taskId', taskExists) 
router.param('taskId', taskBelongsProject)

router.get('/:projectId/tasks/:taskId',
   param("taskId").isMongoId().withMessage("Id not valid"),
   handleInputErrors, 
   TaskController.getTasksById
)

router.put('/:projectId/tasks/:taskId',
   hasAuthorization,
   param("taskId").isMongoId().withMessage("Id not valid"),
   body("name").notEmpty().withMessage("Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
   handleInputErrors, 
   TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
   hasAuthorization,
   param("taskId").isMongoId().withMessage("Id not valid"),
   handleInputErrors, 
   TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
   param("taskId").isMongoId().withMessage("Id not valid"),
   body('status').notEmpty().withMessage('Status is required'),
   handleInputErrors, 
   TaskController.changeTaskStatus
)

router.get("/:projectId/team",
   TeamMemberController.getTeamMembers
)

router.post("/:projectId/team/find",
   hasAuthorization,
   body('email')
      .isEmail().toLowerCase().withMessage('Invalid Email'),
   handleInputErrors,
   TeamMemberController.findMemberByEmail
)

router.post("/:projectId/team",
   hasAuthorization,
   body('id')
      .isMongoId().withMessage("Id not valid"),
   handleInputErrors,
   TeamMemberController.addMemberById
)

router.delete("/:projectId/team/:userId",
   param('userId')
      .isMongoId().withMessage("Id not valid"),
   handleInputErrors,
   TeamMemberController.removeMemberById
)

router.post("/:projectId/tasks/:taskId/notes",
   body('content')
      .notEmpty().withMessage("Content is required"),
   handleInputErrors,
   NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes",
   NoteController.getTaskNotes
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
   param('noteId')
      .isMongoId().withMessage("Id not valid"),
   handleInputErrors,
   NoteController.deleteNote
)


export default router;
