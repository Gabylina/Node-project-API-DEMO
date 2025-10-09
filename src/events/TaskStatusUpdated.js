// migrated from App\Events\TaskStatusUpdated

export class TaskStatusUpdated {
  static event = 'TaskStatusUpdated';

  constructor(payload = {}) {
    Object.assign(this, payload);
  }
}


export default { TaskStatusUpdated };