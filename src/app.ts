import express, { Application } from "express";
import { json } from "body-parser";
import {  LOGOS_FOLDER, PORT } from "./env";
const fileUpload = require('express-fileupload');
import route from "./routes/index";
import cors from 'cors';


export default class App {
	public app: Application;
	public port: number;

	constructor() {
		this.app = express();
		this.port = PORT;
		this.initializeMiddlewares();
	}

	private initializeMiddlewares() {
		this.app.use(json());
		this.app.use(fileUpload());
		this.app.use(cors());
		this.app.use(`/${LOGOS_FOLDER}`, express.static(LOGOS_FOLDER));
		route(this.app);
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`App listening on the port ${this.port}`);
		});
	}
}
