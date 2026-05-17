import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { Dialog } from 'primeng/dialog';
import { ProjectBoardResponse } from '../../../../core/models/project.model';
import { KanbanService } from '../../services/kanban.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor } from 'primeng/editor';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-kanban-board',
  imports: [
    CdkDropList,
    CdkDrag,
    CommonModule,
    PortalModule,
    Dialog,
    CdkDragHandle,
    CdkDragPlaceholder,
    Menu,
    ConfirmDialogModule,
    ReactiveFormsModule,
    Editor,
    Textarea,
  ],
  providers: [ConfirmationService],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard implements OnInit {
  @Input({ required: true }) projectId!: string;

  protected isKanbanExpanded: boolean = false;
  protected kanbanColumns: KanbanColumnResponse[] | null = null;
  protected editingColumnId: string | null = null;
  private activeColumn: KanbanColumnResponse | null = null;
  protected columnMenuItems: MenuItem[] = [
    {
      label: 'Renomear',
      icon: 'pi pi-pencil',
      command: () => {
        if (this.activeColumn) this.startEditColumn(this.activeColumn.id);
      },
    },
    {
      label: 'Excluir Coluna',
      icon: 'pi pi-trash',
      command: () => {
        if (this.activeColumn) this.deleteColumn(this.activeColumn.id);
      },
    },
  ];

  protected addingTaskToColumnId: string | null = null;
  protected isTaskModalOpen: boolean = false;
  protected selectedTask: KanbanTaskResponse | null = null;

  protected taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private service: KanbanService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.findBoard(this.projectId);
  }

  findBoard(id: string): void {
    this.service.findBoard(id).subscribe({
      next: (board: ProjectBoardResponse) => {
        this.kanbanColumns = board.columns;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error),
    });
  }

  openColumnMenu(event: Event, menu: any, column: KanbanColumnResponse) {
    this.activeColumn = column;
    menu.toggle(event);
  }

  dropColumn(event: CdkDragDrop<KanbanColumnResponse[]>) {
    if (event.previousIndex === event.currentIndex) return;
    const columns = this.kanbanColumns;
    if (!columns) return;
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    const columnId = columns[event.currentIndex].id;
    const newPosition: KanbanColumnMoveRequest = {
      position: event.currentIndex + 1,
    };
    this.service.moveColumn(this.projectId, columnId, newPosition).subscribe({
      error: () => {
        moveItemInArray(columns, event.currentIndex, event.previousIndex);
      },
    });
  }

  addNewColumn() {
    const columns = this.kanbanColumns;
    if (!columns) return;

    const tempId = 'TEMP-' + Date.now();
    const newPos = columns.length + 1;

    columns.push({
      id: tempId,
      name: '',
      position: newPos,
      tasks: [],
    });

    this.startEditColumn(tempId);

    setTimeout(() => {
      const container = document.querySelector('.overflow-x-auto.custom-scrollbar');
      if (container) {
        container.scrollTo({
          left: container.scrollWidth,
          behavior: 'smooth',
        });
      }
    }, 100);
  }

  startEditColumn(columnId: string) {
    this.editingColumnId = columnId;
  }

  saveColumnName(column: KanbanColumnResponse, newName: string) {
    const trimmedName = newName.trim();
    this.editingColumnId = null;

    const columns = this.kanbanColumns;
    if (!columns) return;

    if (!trimmedName) {
      if (column.id.startsWith('TEMP')) {
        this.kanbanColumns = columns.filter((c) => c.id !== column.id);
      }
      return;
    }
    column.name = trimmedName;

    if (column.id.startsWith('TEMP')) {
      const payload: KanbanColumnCreateRequest = { name: trimmedName, position: column.position };
      this.service.createColumn(this.projectId, payload).subscribe({
        next: (response) => (column.id = response.id),
      });
    } else {
      const payload: KanbanColumnRenameRequest = { name: trimmedName };
      this.service.renameColumn(column.id, payload).subscribe();
    }
  }

  cancelEditColumn(column: KanbanColumnResponse) {
    this.editingColumnId = null;

    const columns = this.kanbanColumns;
    if (!columns) return;

    if (!column.name || column.id.startsWith('TEMP')) {
      this.kanbanColumns = columns.filter((c) => c.id !== column.id);
    }
  }

  deleteColumn(columnId: string) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir esta coluna? Todas as tarefas dentro dela também serão removidas permanentemente.',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const columns = this.kanbanColumns;
        if (!columns) return;
        this.kanbanColumns = columns.filter((c) => c.id !== columnId);
        this.service.deleteColumn(columnId).subscribe({
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir a coluna.',
            });
          },
        });
        this.cdr.detectChanges();
      },
    });
  }

  dropTask(event: CdkDragDrop<KanbanTaskResponse[]>) {
    const column = this.kanbanColumns;
    if (!column) return;

    const previousColumn = column.find((c) => c.tasks === event.previousContainer.data);
    const currentColumn = column.find((c) => c.tasks === event.container.data);

    if (!previousColumn || !currentColumn) return;
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const taskId = event.container.data[event.currentIndex].id;
    const targetColumnId = event.container.id;
    const newPosition = event.currentIndex + 1;

    const payload: KanbanTaskMoveRequest = {
      columnId: targetColumnId,
      position: newPosition,
    };

    this.service.moveTask(taskId, payload).subscribe({
      next: (response) => {
        console.log('Tarefa movida com sucesso');
      },
      error: (error) => {
        console.error('Erro ao mover tarefa:', error);
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.currentIndex, event.previousIndex);
        } else {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          );
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Erro de Sincronização',
          detail: 'Não foi possível salvar a nova posição da tarefa.',
        });
      },
    });
  }

  startAddTask(columnId: string) {
    this.addingTaskToColumnId = columnId;
  }

  cancelAddTask() {
    this.addingTaskToColumnId = null;
  }

  saveNewTask(column: KanbanColumnResponse, title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      this.cancelAddTask();
      return;
    }

    const tempTask: KanbanTaskResponse = {
      id: 'TEMP-TASK-' + Date.now(),
      title: trimmedTitle,
      description: '',
      position: column.tasks.length + 1,
    };

    column.tasks.push(tempTask);
    const payload = {
      title: trimmedTitle,
      description: '',
      position: tempTask.position,
      columnId: column.id,
    };
    this.service.createTask(column.id, payload).subscribe({
      next: (response: KanbanTaskResponse) => (tempTask.id = response.id),
    });
  }

  openTaskDetails(task: KanbanTaskResponse) {
    console.log('Abrir detalhes da tarefa:', task);
    this.selectedTask = task;
    this.isTaskModalOpen = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description || '',
      });
    }, 0);
  }

  closeTaskDetails() {
    this.isTaskModalOpen = false;
    this.selectedTask = null;
    this.taskForm.reset();
  }

  saveTaskDetails() {
    if (this.taskForm.invalid || !this.selectedTask) return;

    const updatedTitle = this.taskForm.value.title!;
    const updatedDescription = this.taskForm.value.description || '';

    const targetTask = this.selectedTask;

    targetTask.title = updatedTitle;
    targetTask.description = updatedDescription;

    const payload: KanbanTaskUpdateRequest = {
      title: updatedTitle,
      description: updatedDescription,
    };

    this.service.updateTask(this.selectedTask.id, payload).subscribe({
      next: () => {
        targetTask.title = updatedTitle;
        targetTask.description = updatedDescription;
      },
      error: () => {
        console.error('Erro ao atualizar tarefa:', this.selectedTask);
      },
    });

    this.closeTaskDetails();
  }

  confirmDeleteTask() {
    if (!this.selectedTask) return;

    this.confirmationService.confirm({
      header: 'Excluir Tarefa',
      message: `Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.`,
      icon: 'pi pi-exclamation-triangle !text-red-500',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: '!bg-red-600 !hover:bg-red-700 !border-none !text-white !px-4 !py-2 !rounded-lg !text-sm',
      rejectButtonStyleClass: '!text-slate-600 !hover:bg-slate-100 !bg-transparent !border-none !px-4 !py-2 !rounded-lg !text-sm !mr-2',
      accept: () => {
        this.deleteTask(this.selectedTask!.id);
      }
    });
  }

  private deleteTask(taskId: string) {
    const columns = this.kanbanColumns;
    if (!columns) return;
    for (const column of columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        break;
      }
    }
    this.closeTaskDetails();
    this.service.deleteTask(taskId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa excluída com sucesso.' });
      },
      error: (err) => {
        console.error(err);
        this.findBoard(this.projectId);
        this.cdr.detectChanges();
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir a tarefa.' });
      }
    });
  }

  get connectedLists(): string[] {
    const columns = this.kanbanColumns;
    if (!columns) return [];
    return columns.map((c) => c.id);
  }
}
