import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserType } from "../models/Auth";

declare global {
   namespace Express {
      interface Request {
         user?: UserType;
      }
   }
}

export const authenticate = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const bearer = req.headers.authorization;
   if (!bearer) {
      const error = new Error("Unauthorized");
      return res.status(401).send({ error: error.message });
   }
   const token = bearer.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decoded === "object" && decoded.id) {
         const user = await User.findById(decoded.id).select("_id name email");
         if (user) {
            req.user = user;
            next();
         } else {
            res.status(500).send({ error: "Invalid Token" });
         }
      }
   } catch (error) {
      res.status(500).send({ error: "Invalid Token" });
   }
};
