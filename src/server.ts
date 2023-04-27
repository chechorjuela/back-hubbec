import 'reflect-metadata';
import { Container } from './config/inversify.config';

const container = new Container();
const app = container.getApp();

app.initialize(process);
app.listen();
