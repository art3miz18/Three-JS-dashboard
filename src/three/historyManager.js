// historyManager.js
export class HistoryManager {
    constructor() {
      this.undoStack = [];
      this.redoStack = [];
    }
  
    addAction(action) {
        this.undoStack.push(action);
        this.redoStack = []; // Clear redo stack on new action
    }
  
    undo = ()=>{
        const action = this.undoStack.pop();
        if (action) {
            action.undo();
            this.redoStack.push(action);
        }
    }
    
    redo() {
      const action = this.redoStack.pop();

      if (action) {
        action.do();
        this.undoStack.push(action);
      }
    }


    //getter methods
    get undoStackSize() {
        return this.undoStack.length;
    }
      
    get redoStackSize() {
        return this.redoStack.length;
    }
  }
  