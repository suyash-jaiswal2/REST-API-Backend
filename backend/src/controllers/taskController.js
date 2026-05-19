const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const prisma = require('../config/db');

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Validation failed', errors.array());

  const { title, description, status } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, description, status: status || 'PENDING', userId: req.user.id },
    });
    return successResponse(res, 201, 'Task created', task);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
    return successResponse(res, 200, 'Tasks fetched', tasks);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ include: { user: { select: { name: true, email: true } } } });
    return successResponse(res, 200, 'All tasks fetched', tasks);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!task) return errorResponse(res, 404, 'Task not found');
    return successResponse(res, 200, 'Task fetched', task);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Validation failed', errors.array());

  const { title, description, status } = req.body;
  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!task) return errorResponse(res, 404, 'Task not found');

    const updated = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, status },
    });
    return successResponse(res, 200, 'Task updated', updated);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!task) return errorResponse(res, 404, 'Task not found');

    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    return successResponse(res, 200, 'Task deleted');
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { createTask, getMyTasks, getAllTasks, getTaskById, updateTask, deleteTask };