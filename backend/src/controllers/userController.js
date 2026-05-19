const { successResponse, errorResponse } = require('../utils/apiResponse');

const prisma = require('../config/db');

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return successResponse(res, 200, 'User fetched', user);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return successResponse(res, 200, 'Users fetched', users);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { getMe, getAllUsers };