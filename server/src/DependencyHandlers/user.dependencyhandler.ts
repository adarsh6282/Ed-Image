import { UserController } from "../controller/implementations/user.controller";
import { UserRepository } from "../repository/implemetations/user.repository";
import { UserService } from "../services/implementations/user.services";
import { OtpRepository } from "../repository/implemetations/otp.repository";

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const userService = new UserService(userRepository, otpRepository);
 export const userController = new UserController(userService);