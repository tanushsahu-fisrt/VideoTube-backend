import { Router } from 'express';
import { allPublicVideos } from "../controllers/video.controller.js"

const router = Router();

router.route("/").get(allPublicVideos);



export default router;