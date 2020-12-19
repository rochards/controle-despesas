const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

/**
 * localStorage -> API do browser para persistir dados do 
 * usuário na aplicação
 */
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [] 

const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID)
    
    init()
    updateLocalStorage()
}

const addTransactionIntoDOM = ({ id, name, amount }) => {
    const operator = amount >= 0 ? '+' : '-'
    const CSSClass = amount >= 0 ? 'plus' : 'minus'
    const amountWithoutOperator = Math.abs(amount).toFixed(2)
    /**
     * createElement -> metodo do document que podemos utilizar
     * para criar um novo elemento HTML
     */
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        <button class="delete-btn" onClick="removeTransaction(${ id })">
            x
        </button>
        <span>${ name }</span>${ operator } R$ ${ dotToComma(amountWithoutOperator) }
    ` // inserindo um codigo html dentro de li
    
    /**
     * Esse método append, ele insere um elemento como último
     * filho do elemento
     */
    transactionUl.append(li)
}

const dotToComma = value => {
    const valueToString = value.toString()

    return valueToString.replace(/\./g, ',')
}

const sumAmounts = (accumulator, value) => accumulator + value

const updateBalanceValues = () => {
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount)

    const income = transactionsAmounts
        .filter(value => value >= 0)
        .reduce(sumAmounts, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce(sumAmounts, 0))
        .toFixed(2)

    const total = (income - expense).toFixed(2)
    
    balanceDisplay.textContent = `R$ ${ dotToComma(total) }`
    incomeDisplay.textContent = `R$ ${ dotToComma(income) }`
    expenseDisplay.textContent = `R$ ${ dotToComma(expense) }`
}

const init = () => {
    /**
     * Limpando a ul. Esse passo eh necessario para nao duplicar
     * as que ja estao exibidas na tela.
     */
    transactionUl.innerHTML = ''

    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)


const addToTransactionsArray = (transactionName, transactionAmount) => {
    const transaction = { 
        id: generateID(), 
        name: transactionName, 
        amount: +transactionAmount // o + serve para transformar um numero
    }

    transactions.push(transaction)
}

const clearInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()//impedindo que o form seja enviado (isso atualizaria a pagina)
    
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
    
    if (isSomeInputEmpty) {
        alert('Preencha o nome e o valor da transação!')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    clearInputs()

}
/**
 * A arrow function passada so vai executar quando
 * o evento de submit do form acontecer
 */
form.addEventListener('submit', handleFormSubmit)