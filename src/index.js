import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Dropdown, DropdownButton } from 'react-bootstrap';

//got this from a tutorial
//returns a clone of the array that we can manipulate
//we use this so we don't mutate state when we update the grid
function arrClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

//box component

class Box extends React.Component {
	toggleBox = () => {
		this.props.toggleBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.toggleBox}
			/>
		);
	}
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxKey = i + "_" + j;

				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxKey}
						row={i}
						col={j}
						toggleBox={this.props.toggleBox}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}



class Main extends React.Component {

  //constructor function
  //set speed
  //set grid size
	constructor() {
		super();
		this.speed = 100;
		this.rows = 30;
		this.cols = 50;

		this.state = {
      //two variables in this system are the generation and the grid itself
      generation: 0,
      //create a two dimensional array and set the items to false
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}
  }

  //for the grid size options
  handleSelect = (evt) => {
		this.gridSize(evt);
	}
  //function to toggle boxes
  //make a clone so we don't mutate state
	toggleBox = (row, col) => {
		let gridCopy = arrClone(this.state.gridFull);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			gridFull: gridCopy
		});
	}

  //seed funtion creates a new grid and fills it 
  //with each box having a 20% chance of being alive
	seed = () => {
		let gridCopy = arrClone(this.state.gridFull);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (Math.floor(Math.random() * 5) === 1) {
					gridCopy[i][j] = true;
				}
			}
		}
		this.setState({
			gridFull: gridCopy
		});
	}

  //clear the interval  
  //execute the play function
	playHandler= () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

  //stops the play function
	pauseHandler = () => {
		clearInterval(this.intervalId);
	}

  //change the speed to the slow preset
  //run the play function
	slow = () => {
		this.speed = 1000;
		this.playHandler();
	}

  //change the speed to the fast preset
  //run the play function
	fast = () => {
		this.speed = 100;
		this.playHandler();
	}

  //replaces the grid with an empty one
	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
    });
    clearInterval(this.intervalId);
	}

  //switch statement for grid sizes
	gridSize = (size) => {
		switch (size) {
			case "1":
				this.cols = 20;
				this.rows = 10;
			break;
			case "2":
				this.cols = 50;
				this.rows = 30;
			break;
			default:
				this.cols = 70;
				this.rows = 50;
		}
		this.clear();

	}

  //this is the algorithm itself
  //loops through each element and checks it against the following rules
  //Any live cell with fewer than two live neighbours dies
  //Any live cell with two or three live neighbours lives on
  //Any live cell with more than three live neighbours dies
  //Any dead cell with exactly three live neighbours becomes a live cell
	play = () => {
		let g = this.state.gridFull;
		let g2 = arrClone(this.state.gridFull);
    //got this implementation from a tutorial
    //I want to make this more sleek if I have time
		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}

	render() {
		return (
			<div className="mainDiv">
				
        <h1>The Game of Life</h1>
				
				<Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
				  toggleBox={this.toggleBox}
				/>
        
        <div className = "top buttons">
          <button className="buttn" onClick={this.playHandler}>
						Play
					</button>
					<button className="buttn" onClick={this.pauseHandler}>
					  Pause
					</button>
					<button className="buttn" onClick={this.clear}>
					  Clear
					</button>
					<button className="buttn" onClick={this.slow}>
					  Slow
					</button>
					<button className="buttn" onClick={this.fast}>
					  Fast
					</button>
					<button className="buttn" onClick={this.seed}>
					  Seed
					</button>
        </div>
        <DropdownButton
            bsStyle = "drpdwn"
						title="Grid Size"
            id="size-menu"
						onSelect={this.handleSelect}
					>
						<Dropdown.Item className = "sizes" eventKey="1">20x10</Dropdown.Item>
						<Dropdown.Item className = "sizes" eventKey="2">50x30</Dropdown.Item>
						<Dropdown.Item className = "sizes" eventKey="3">70x50</Dropdown.Item>
				</DropdownButton>
				<h2>Generations: {this.state.generation}</h2>
        <div className= "info">
          <h3>About the algorithm</h3>
          <p>
            Conway's game of life is a cellular automaton that operates on four simple rules:
          </p>
          <ul>
            <li>Any live cell with fewer than two live neighbours dies</li>
            <li>Any live cell with two or three live neighbours lives on</li>
            <li>Any live cell with more than three live neighbours dies</li>
            <li>Any dead cell with exactly three live neighbours becomes a live cell</li>
          </ul>
          <p>
            From these simple rules, many very interesting patterns emerge.
          </p>
        </div>
			</div>
		);
	}
}


ReactDOM.render(<Main />, document.getElementById('root'));