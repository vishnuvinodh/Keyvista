  import jwt from "jsonwebtoken";

  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "abc");
      req.user = decoded; // 👈 THIS FIXES req.user
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  export default verifyToken;
