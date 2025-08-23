import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import { TodoItem } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface TodoListProps {
  applicationId?: string;
  programId?: string;
  showAddButton?: boolean;
  maxItems?: number;
}

export function TodoList({ applicationId, programId, showAddButton = true, maxItems }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    category: 'routine' as TodoItem['category'],
    dueDate: ''
  });

  useEffect(() => {
    loadTodos();
  }, [applicationId, programId]);

  const loadTodos = () => {
    let allTodos = storageUtils.getTodoItems();
    
    // Filter by application or program if specified
    if (applicationId) {
      allTodos = allTodos.filter(todo => todo.applicationId === applicationId);
    }
    if (programId) {
      allTodos = allTodos.filter(todo => todo.programId === programId);
    }
    
    // Sort by priority and due date
    allTodos.sort((a, b) => {
      const priorityOrder = { urgent: 0, important: 1, routine: 2 };
      const priorityDiff = priorityOrder[a.category] - priorityOrder[b.category];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (maxItems) {
      allTodos = allTodos.slice(0, maxItems);
    }
    
    setTodos(allTodos);
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      title: newTodo.title.trim(),
      description: newTodo.description.trim() || undefined,
      completed: false,
      category: newTodo.category,
      dueDate: newTodo.dueDate || undefined,
      createdAt: new Date().toISOString(),
      applicationId,
      programId
    };

    storageUtils.saveTodoItem(todo);
    setNewTodo({ title: '', description: '', category: 'routine', dueDate: '' });
    setIsAddDialogOpen(false);
    loadTodos();
  };

  const handleEditTodo = () => {
    if (!editingTodo || !editingTodo.title.trim()) return;

    const updatedTodo: TodoItem = {
      ...editingTodo,
      title: editingTodo.title.trim(),
      description: editingTodo.description?.trim() || undefined,
      category: editingTodo.category,
      dueDate: editingTodo.dueDate || undefined
    };

    storageUtils.saveTodoItem(updatedTodo);
    setEditingTodo(null);
    loadTodos();
  };

  const handleDeleteTodo = (todoId: string) => {
    storageUtils.deleteTodoItem(todoId);
    loadTodos();
  };

  const handleToggleComplete = (todoId: string) => {
    storageUtils.toggleTodoComplete(todoId);
    loadTodos();
  };

  const getCategoryIcon = (category: TodoItem['category']) => {
    switch (category) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'important':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category: TodoItem['category']) => {
    switch (category) {
      case 'urgent':
        return 'destructive';
      case 'important':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks & Reminders</h3>
        {showAddButton && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newTodo.category} onValueChange={(value: TodoItem['category']) => setNewTodo({ ...newTodo, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTodo} className="flex-1">Add Task</Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {todos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No tasks yet. Add your first task to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <Card key={todo.id} className={`transition-all ${todo.completed ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                          {todo.title}
                        </h4>
                        {todo.description && (
                          <p className={`text-sm text-muted-foreground mt-1 ${todo.completed ? 'line-through' : ''}`}>
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getCategoryColor(todo.category)} className="text-xs">
                            {getCategoryIcon(todo.category)}
                            {todo.category}
                          </Badge>
                          {todo.dueDate && (
                            <div className={`flex items-center gap-1 text-xs ${
                              isOverdue(todo.dueDate) && !todo.completed ? 'text-destructive' : 'text-muted-foreground'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {formatDueDate(todo.dueDate)}
                              {isOverdue(todo.dueDate) && !todo.completed && (
                                <span className="text-destructive">(Overdue)</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTodo(todo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Task</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Title *</label>
                                <Input
                                  value={editingTodo?.title || ''}
                                  onChange={(e) => setEditingTodo(editingTodo ? { ...editingTodo, title: e.target.value } : null)}
                                  placeholder="Enter task title"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                  value={editingTodo?.description || ''}
                                  onChange={(e) => setEditingTodo(editingTodo ? { ...editingTodo, description: e.target.value } : null)}
                                  placeholder="Optional description"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Priority</label>
                                <Select 
                                  value={editingTodo?.category || 'routine'} 
                                  onValueChange={(value: TodoItem['category']) => setEditingTodo(editingTodo ? { ...editingTodo, category: value } : null)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="routine">Routine</SelectItem>
                                    <SelectItem value="important">Important</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Due Date</label>
                                <Input
                                  type="date"
                                  value={editingTodo?.dueDate || ''}
                                  onChange={(e) => setEditingTodo(editingTodo ? { ...editingTodo, dueDate: e.target.value } : null)}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleEditTodo} className="flex-1">Save Changes</Button>
                                <Button variant="outline" onClick={() => setEditingTodo(null)}>Cancel</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}