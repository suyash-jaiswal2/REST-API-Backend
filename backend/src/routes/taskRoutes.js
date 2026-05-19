const express = require('express');
const { body } = require('express-validator');
const {
  createTask, getMyTasks, getAllTasks, getTaskById, updateTask, deleteTask,
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [body('title').notEmpty().withMessage('Title is required')],
  createTask
);
router.get('/', getMyTasks);
router.get('/admin/all', authorizeAdmin, getAllTasks);
router.get('/:id', getTaskById);
router.put(
  '/:id',
  [body('title').notEmpty().withMessage('Title is required')],
  updateTask
);
router.delete('/:id', deleteTask);

module.exports = router;