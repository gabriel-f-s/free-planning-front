interface KanbanColumnResponse {
  id: string,
  name: string,
  position: number,
  tasks: KanbanTaskResponse[]
}

interface KanbanColumnCreateRequest {
  name: string,
  position: number
}

interface KanbanColumnMoveRequest {
  position: number,
}

interface KanbanColumnRenameRequest {
  name: string,
}

interface KanbanTaskResponse {
  id: string,
  title: string,
  description: string,
  position: number
}

interface KanbanTaskCreateRequest {
  title: string,
  description: string,
  position: number,
}

interface KanbanTaskUpdateRequest {
  title: string,
  description: string,
}

interface KanbanTaskMoveRequest {
  position: number,
  columnId: string
}
