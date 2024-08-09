const ArrayList = JSON.parse(localStorage.getItem('ArrayList')) || [];
let Income = parseFloat(localStorage.getItem('Income')) || 0;

function RenderArrayList() {
    let todoListHTML = '';
    let Total = 0;

    for (let i = 0; i < ArrayList.length; i++) {
        const todoObject = ArrayList[i];
        const CatName = todoObject.Category;
        const DueAmount = todoObject.Amount;
        const Notes = todoObject.Notes;
        const Date = todoObject.DueDate;

        const html = `
            <div class="GridObjectList">${CatName}</div>
            <div class="GridObjectList">${DueAmount}</div>
            <div class="GridObjectList">${Notes}</div>
            <div class="GridObjectList">${Date}</div>
            <div class="GridObjectListDelBtn"><button onclick='deleteItem(${i})' class="DeleteBtn">Delete</button></div>
        `;
        todoListHTML += html;

        Total += parseFloat(DueAmount) || 0;
    }

    const Remainder = Income - Total;

    document.querySelector('.NewItemList').innerHTML = todoListHTML;
    document.querySelector('.ResultExpenseTotal').innerHTML = `<p>Total: ${Total}</p>`;
    document.querySelector('.ResultBudget').innerHTML = `<p>Budget: ${Income}</p>`;
    document.querySelector('.ResultRemainder').innerHTML = Remainder >= 0 
        ? `<p>Remaining: ${Remainder}</p>` 
        : `<p>Remaining: <span class="RedColour">${Remainder} is ${Math.abs(Remainder)} Over Budget</span></p>`;
}

function AddIncome() {
    let IncomeInput = document.querySelector('.InputSum');
    Income = parseFloat(IncomeInput.value) || 0;
    IncomeInput.value = '';

    localStorage.setItem('Income', Income);

    RenderArrayList();
}

function InputselectedAll() {
    const CategoryInput = document.querySelector('.InputCategory');
    const Categoryname = CategoryInput.value;

    const AmountInput = document.querySelector('.InputExpense');
    const AmountDue = parseFloat(AmountInput.value) || 0;

    const NotesInput = document.querySelector('.InputNotes');
    const DetailNotes = NotesInput.value;

    const DuedateInput = document.querySelector('.DateInput');
    const today = new Date().toISOString().split('T')[0];
    DuedateInput.setAttribute('max', today); 

    let Duedate = DuedateInput.value;

    if (!Duedate) {
        Duedate = today;
        DuedateInput.value = today;
    }

    
    const newTotal = ArrayList.reduce((sum, item) => sum + parseFloat(item.Amount), 0) + AmountDue;

    if (newTotal > Income) {
        const confirmExceed = confirm(`Your budget will be exceeded by ${newTotal - Income}. Do you still wish to add this entry?`);
        if (!confirmExceed) {
            return;
        }
    }

    ArrayList.push({
        Category: Categoryname,
        Amount: AmountDue,
        Notes: DetailNotes,
        DueDate: Duedate
    });

    localStorage.setItem('ArrayList', JSON.stringify(ArrayList));
    RenderArrayList();

    CategoryInput.value = '';
    AmountInput.value = '';
    NotesInput.value = '';
    DuedateInput.value = '';

    console.log(ArrayList);
}

function deleteItem(index) {
    ArrayList.splice(index, 1);
    localStorage.setItem('ArrayList', JSON.stringify(ArrayList));
    RenderArrayList();
}

RenderArrayList();
