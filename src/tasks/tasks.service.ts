import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import IResourceService from './resource-service.interface';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService /*implements IResourceService<TaskEntity>*/ {
  constructor(
    @InjectRepository(Task)
    private _taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this._taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere("task.status = :status", {status: 'OPEN'});
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%`},
      );
    }

    const task: Task[] = await query.getMany();
    return task;


  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this._taskRepository.findOne({ where: { id, user } });
  
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  
    return found;
  }
  

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = this._taskRepository.create({
      title, 
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this._taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deleteResult = await this._taskRepository.delete({ id, user });

    if (deleteResult.affected === 0 ) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user): Promise<Task>{
    const task: Task = await this.getTaskById(id, user);
    task.status = status;
    await this._taskRepository.save(task);
    return task;
  }
}
