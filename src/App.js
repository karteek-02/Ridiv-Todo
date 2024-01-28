import React, { useState, useEffect } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
function App() {
  const [allTodos, setAllTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  const handleAddNewToDo = () => {  
    if (newTodoTitle || newDescription) {
       let newToDoObj = {
         title: newTodoTitle,
         description: newDescription,
       };
       let updatedTodoArr = [...allTodos];
       updatedTodoArr.push(newToDoObj);
       setAllTodos(updatedTodoArr);
       localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
       setNewDescription('');
       setNewTodoTitle('');
    } else {
       alert("Please enter a title or description.");
    }
   };
   

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedToDos = JSON.parse(
      localStorage.getItem('completedTodos')
    );
    if (savedTodos) {
      setAllTodos(savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos(savedCompletedToDos);
    }
  }, []);

  const handleToDoDelete = index => {
    let reducedTodos = [...allTodos];
    reducedTodos.splice(index, 1);
    // console.log (index);

    // console.log (reducedTodos);
    localStorage.setItem('todolist', JSON.stringify(reducedTodos));
    setAllTodos(reducedTodos);
  };

  const handleCompletedTodoDelete = index => {
    let reducedCompletedTodos = [...completedTodos];
    reducedCompletedTodos.splice(index, 1);
    localStorage.setItem('completedTodos', JSON.stringify(reducedCompletedTodos));
    setCompletedTodos(reducedCompletedTodos);
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
   
    const items = Array.from(allTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
   
    setAllTodos(items);
   }
   

  const handleComplete = index => {
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var minutes = date.getMinutes();
    var ss = date.getSeconds();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredTodo = {
      ...allTodos[index],
      completedOn: finalDate,
    };

    // console.log (filteredTodo);

    let updatedCompletedList = [...completedTodos, filteredTodo];
    console.log(updatedCompletedList);
    setCompletedTodos(updatedCompletedList);
    localStorage.setItem(
      'completedTodos',
      JSON.stringify(updatedCompletedList)
    );
    // console.log (index);

    handleToDoDelete(index);
  };

  return (
    <div className="App">
      <h1 className='mt-16 text-3xl'>Task Tracker</h1>

      <div className="todo-wrapper">

        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newTodoTitle}
              style={{ color: 'black'}}
              onChange={e => setNewTodoTitle(e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              style={{ color: 'black' }}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn "
              style={{marginTop: '35px' , borderRadius: '10%'}}
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen(false)}
            style={{borderRadius: '10%'}}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ml-1 ${isCompletedScreen === true && 'active'}` }
            onClick={() => setIsCompletedScreen(true)}
            style={{borderRadius: '10%'}}
          >
            Completed
          </button>
        </div>


        <div className="todo-list">
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                  {isCompletedScreen === false && allTodos.length > 0 &&
                    allTodos.filter(item => item !== null).map((item, index) => (
                      <Draggable key={index} draggableId={index.toString()} index={index}>
                        {(provided) => (
                          <div className="todo-list-item" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <div>
                              <h3>{item.title}</h3>
                              <p>{item.description}</p>
                            </div>
                            <div className="icon-container">
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <AiOutlineDelete
                                  title="Delete?"
                                  className="icon"
                                  onClick={() => handleToDoDelete(index)}
                                />
                                <BsCheckLg
                                  title="Completed?"
                                  className="check-icon mt-2"
                                  onClick={() => handleComplete(index)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {isCompletedScreen === true && completedTodos.length > 0 &&
                    completedTodos.filter(item => item !== null).map((item, index) => (
                      <Draggable key={index} draggableId={index.toString()} index={index}>
                        {(provided) => (
                          <div className="todo-list-item" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <div>
                              <h3>{item.title}</h3>
                              <p>{item.description}</p>
                              <p> <i>Completed at: {item.completedOn}</i></p>
                            </div>
                            <div>
                              <AiOutlineDelete
                                className="icon"
                                onClick={() => handleCompletedTodoDelete(index)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

      </div>
    </div>
  );
}

export default App;