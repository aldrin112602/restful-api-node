import prisma from "../model/prismaClient.js";
import { userSchema } from "../utils/globalZodSchema.js";
import formatZodError from "../utils/formatZodError.js";

/** * UserController - Controller for managing user operations
 * @module UserController
 * @requires prisma - Prisma client for database operations
 * @typedef {import("../model/prismaClient.js").PrismaClient} PrismaClient
 * @property {PrismaClient} prisma - The Prisma client instance
 * */

const UserController = {
  /**
   * Create a new user
   * @param {Object} req - The request object containing user data
   * @param {Object} res - The response object to send back the created user
   * @return {Promise<void>} - A promise that resolves when the user is created
   * @throws {Error} - Throws an error if user creation fails
   * */
  async createUser(req, res) {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodError(result.error);
      return res.status(400).json({ errors });
    }
    try {
      const user = await prisma.user.create({
        data: result.data,
      });
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  /**
   * Get a user by ID
   * @param {Object} req - The request object containing the user ID
   * @param {Object} res - The response object to send back the user data
   * @return {Promise<void>} - A promise that resolves when the user is fetched
   * @throws {Error} - Throws an error if user retrieval fails
   * */
  async getUser(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ error: "Invalid user ID" });

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /**
   * Update a user by ID
   * @param {Object} req - The request object containing the user ID and updated data
   * @param {Object} res - The response object to send back the updated user data
   * @return {Promise<void>} - A promise that resolves when the user is updated
   * @throws {Error} - Throws an error if user update fails
   * */
  async updateUser(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ error: "Invalid user ID" });

    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodError(result.error);
      return res.status(400).json({ errors });
    }
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: result.data,
      });
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /**
   * Delete a user by ID
   * @param {Object} req - The request object containing the user ID
   * @param {Object} res - The response object to send back a success message
   * @return {Promise<void>} - A promise that resolves when the user is deleted
   * @throws {Error} - Throws an error if user deletion fails
   * */
  async deleteUser(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ error: "Invalid user ID" });

    try {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: error?.meta?.cause || "Internal Server Error" });
    }
  },

  /**
   * List all users
   * @param {Object} req - The request object
   * @param {Object} res - The response object to send back the list of users
   * @return {Promise<void>} - A promise that resolves when the users are listed
   * @throws {Error} - Throws an error if user listing fails
   * */
  async listUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /**
   * Search users by name or email
   * @param {Object} req - The request object containing the search query
   * @param {Object} res - The response object to send back the search results
   * @return {Promise<void>} - A promise that resolves when the search is completed
   * @throws {Error} - Throws an error if search fails
   * */
  async searchUsers(req, res) {
    const { query } = req.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, lte: "insensitive" } },
            { email: { contains: query, lte: "insensitive" } },
          ],
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

/** * @typedef {Object} UserController
 * @property {Function} createUser - Create a new user
 * @property {Function} getUser - Get a user by ID
 * @property {Function} updateUser - Update a user by ID
 * @property {Function} deleteUser - Delete a user by ID
 * @property {Function} listUsers - List all users
 * @property {Function} searchUsers - Search users by name or email
 */
export default UserController;
