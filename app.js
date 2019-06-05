// 
// 
// 
// 
// -----------  some pretaste example, very important example to show you how do you use EIIF and closure ---------
// 
// 
// 
// var budgetController = (function () {

// 	var x = 19; // private variable

// 	var add = function (a) { // private variable
// 		return x + a;
// 	 }
// 	return { 
// 		publicTest: function(b) { // the private function form an object could be called publically
// 	 		return add(b);
// 		}
// 	}
// })();
  
 
// var UIController = (function () {
// 	// some code
// })();


// var controller = (function(budgetCtrl, UICtrl) {
// 	var z = budgetCtrl.publicTest(19); 
// 	return {
// 		anotherPublic: function () {	
// 			console.log(z);
// 		}
// 	}
// })(budgetController, UIController);


// the simplest example of clousre
/*
var passed  =8;
var add = function () {
	var x = 2;
	return x + passed;
}

console.dir(add);

*/


// BUDGET CONTROLLER
var budgetController = (function () {
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	}

	Expense.prototype.calcPercentage = function (totalIncome) {
		if(totalIncome > 0) {
			this.percentage = Math.round((this.value/ totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function () {
		return this.percentage;
	}

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value
	}

	var calculateTotal = function (type) {
			// the totals
			var sum = 0;
			data.allItems[type].forEach(function (el) {
				sum += el.value;
			})
			data.totals[type] = sum;
	}

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0 
		},
		budget: 0,
		percentage: -1
	};

	


	return {
		addItem: function (type, des, val) {
			var newItem, ID;
			// Create a new ID
			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id +1; 
			} else{
				ID = 0;
			}
			

			// Create a new item based on 'exp' or 'inc'
			if(type === "exp") {
				newItem = new Expense(ID, des, val);
			}else if (type === "inc") {
				newItem = new Income(ID, des, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},
		deleteItem: function (type, id) {
			var ids, index;

			//id = 6
			//data.allItems[type][id]
			// ids = [1 2 4 6 8]
			// index = 3
			// 
			ids = data.allItems[type].map(function (current) {
				return current.id;
			})
			index = ids.indexOf(id);
			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}
			
		},


		calculateBudget : function () {
			// calculate total
			calculateTotal("inc");
			calculateTotal("exp");
			// calculate the budget: totalInc - totalExp	
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage: totalExp / totalInc
			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else {
				data.percentage = -1;
			}
			// Expense is 100 and income is 300, spent 33.33% = 100/300 = 0.3333* 100
		},

		calculatePercentages: function () {

			/*
			20
			40
			30
			a: 20/100 = 20%;
			b: 40/100 = 40%;
			c: 30/100 = 30%
			 */
			
			data.allItems.exp.forEach( function (cur) {
				cur.calcPercentage(data.totals.inc);
			})
		},

		getPercentages: function () { // map() returns the element from an array
			var allPerc = data.allItems.exp.map( function (cur) {
				return cur.getPercentage();
			})
			return allPerc;
		},

		getBudget : function () {
			return {
				totalExp :data.totals.exp,
				totalInc : data.totals.inc,
				budget: data.budget,
				percentage: data.percentage
			};
		},
		testing: function () {
			console.log(data);
		}
	}
})();

// UI CONTROLLER
var UIController = (function () {
	var DOMstrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputButton: ".add__btn",
		incomeContainer: ".income__list",
		expensesContainer: ".expenses__list",
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expensesLabel: ".budget__expenses--value",
		percentageLabel : ".budget__expenses--percentage",
		container: ".container",
		expensesPercLabel: ".item__percentage",
		dateLabel: ".budget__title--month"
		};

	var formatNumber = function(num, type) {
			/*
			+ or - before the number
			two decimal digits
			seperate the thounsand by ,
			 */

			num = Math.abs(num); // return the absolute value
			num = num.toFixed(2); // num = 14.38;
			numSplit = num.split(".");
			int = numSplit[0];
			if(int.length > 3) {
				if(int.length > 6){
					int = int.substr(0, int.length - 6) + "," + int.substr(int.length - 6, int.length  - 4) + "," + 
					int.substr(int.length - 3, 3);
				}else {
					int = int.substr(0, int.length - 3) + "," + int.substr(int.length-3, 3);
				}
			}

			dec = numSplit[1];

			return (type === "exp" ? "-" : "+") + " " + int + "." + dec;

		};
		var nodeListForEach = function (list, callback) {
				for(var i = 0; i < list.length; i ++) {
					callback(list[i], i);
				}
			};

	return {
		getInput: function() {
			return {
				type : document.querySelector(DOMstrings.inputType).value,
				description : document.querySelector(DOMstrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},
		addListItems: function (obj, type) {
			var html, newHtml, element;
			// Create the HTML string with placeholder text
			if(type === "inc"){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';	
			}
			else if (type === "exp") {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// Replace placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type)); 


			// insert the HTML into DOM
			// (element.insertAjacentHTML(postition, text); )
			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
		},

		deleteListItems: function (selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		clearFields: function () {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
			// make the element to an array : Array.prototype.
			fieldsArr = Array.prototype.slice.call(fields); 
			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});
			fields[0].focus(); // makes the description filed focused
		},
		displayBudget : function (obj) {
			var type;
			obj.budget > 0 ? type = "inc" : type = "exp";
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");
			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + " %";
			}else {
				document.querySelector(DOMstrings.percentageLabel).textContent = "---";
			}
		},
		displayPercentages: function (percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			

			nodeListForEach (fields, function (current, index) {
				current.textContent = percentages[index] + "%";
			})
		},
		displayMonth: function () {
			var now, year, month, months;
			now = new Date();
			year = now.getFullYear();
			month = now.getMonth(); // the index of the month : 0 ~ 11
			months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;
		},
		changedType: function () {
			var fields = document.querySelectorAll(
				DOMstrings.inputType + "," +
				DOMstrings.inputDescription + "," +
				DOMstrings.inputValue);
			// use the nodeListForEach function 
			nodeListForEach(fields, function (cur) {
				cur.classList.toggle("red-focus");
			})
			document.querySelector(DOMstrings.inputButton).classList.toggle("red");
		},


		getDOMstrings : function(){
			return DOMstrings;
		}
	};
})();




// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
		document.addEventListener("keypress", function(event){
			if(event.keyCode === 13){
				ctrlAddItem();
			}
		})
		document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener("change",UICtrl.changedType);

	}

	var updateBudget = function () {
		// 1. Calculate the budget 

		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	}

	var updatePercentages = function () {
		// Calculate the percentage
		budgetCtrl.calculatePercentages();

		// Read the percentage from budget Controller
		var percentages = budgetCtrl.getPercentages();
		
		// Update the UI with the new percentage
		UICtrl.displayPercentages(percentages);
	}


	var ctrlAddItem = function () {
		var input, newItem;
		// 1. Get the field input date
		input = UICtrl.getInput();
		// console.log(input);
		
		if(input.description !== "" && ! isNaN(input.value) && input.value > 0) {
		// 2. Add the item to the budgetController
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			
			// 3. Add the new item to the UI
			UICtrl.addListItems(newItem, input.type);

			//4. Clear the fields
			UICtrl.clearFields();

			//5. Update the Budget
			updateBudget();

			// 6. Calculate and update the percentage
			updatePercentages();
		}
	}

	var ctrlDeleteItem = function (event) {
		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		// console.log(itemID);
		if(itemID) {
			// inc-1
			splitID = itemID.split("-");
			type = splitID[0];
			ID = parseInt(splitID[1]);
			// delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);

			// delete the item from the UI
			UICtrl.deleteListItems(itemID);

			// update and show the new budget
			updateBudget();

			// Calculate and update the percentage
			updatePercentages();
			
		}
	}

	// Create a init function 
	return {
		init : function () {
			console.log("the server has already started");
			UICtrl.displayMonth();
			setupEventListeners();
			UICtrl.displayBudget({
				totalExp :0,
					totalInc: 0,
					budget: 0,
					percentage: 0
			});
		}
	}

})(budgetController, UIController);

controller.init(); // invoke init function










