import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import IResourceService from './resource-service.interface';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
@Injectable()
export class TasksService /*implements IResourceService<TaskEntity>*/ {
  constructor(
    @InjectRepository(Task)
    private _taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this._taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere("task.status = :status", {status: 'OPEN'});
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%`},
      );
    }

    const task: Task[] = await query.getMany();
    return task;


  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this._taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = this._taskRepository.create({
      title, 
      description,
      status: TaskStatus.OPEN,
    });

    await this._taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const deleteResult = await this._taskRepository.delete(id);

    if (deleteResult.affected === 0 ) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task>{
    const task: Task = await this.getTaskById(id);
    task.status = status;
    await this._taskRepository.save(task);
    return task;
  }
}
