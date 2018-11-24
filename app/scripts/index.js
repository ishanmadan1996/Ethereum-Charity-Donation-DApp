// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metaCoinArtifact from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metaCoinArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      //const acc = parseInt(document.getElementById('AccoutnNumber').value)
      accounts = accs
      account = accounts[0]

      self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },
 

  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },
  generateID:function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    document.getElementById('uniqueID').value=Math.random().toString(36).substr(2, 9);
  },
  getPreviousInfo: function(){
    let meta
    MetaCoin.deployed().then(function(instance){
      meta = instance
      meta.getaddress.call({from: account}).then(function(value){
        const receiver = value
        meta.getInfoPrevious.call(receiver,{from: account}).then(function(returnValues){
          //document.getElementById("receiver").value= returnValues[0]
          document.getElementById("amount").value = returnValues[1]
          document.getElementById("uniqueID").value = returnValues[2]
        })
      })
      
    })
  },
  getAccount: function(){
    alert(account)
  },
  getInfoByID: function(){
    let meta
    MetaCoin.deployed().then(function(instance){
      meta = instance;
      const id = document.getElementById('uniqueID').value
      meta.getTransactionByID.call(id,{from:account}).then(function(returnValues){
        //document.getElementById("receiver").value= returnValues[2]
        document.getElementById("amount").value = returnValues[1]
        document.getElementById("locationName").value = returnValues[0]
      })
    })
  },

  getAnyLocation: function(){
    let meta
    MetaCoin.deployed().then(function (instance){
      meta = instance
      const locationno = parseInt(document.getElementById('Transactionno').value)
        meta.GetLocation.call(locationno-1,{ from: account }).then( function(returnValues){
          //alert(returnValues)
          document.getElementById("receiver").value= returnValues[2]
          document.getElementById("amount").value = returnValues[1]
          document.getElementById("locationName").value = returnValues[0]
  
     
        }).catch(function(e) {
         console.log(e)
        })
      })

   
  },
  
  

  sendCoin: function () {
    const self = this
    const id = document.getElementById('uniqueID').value
    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value
    const name = document.getElementById('locationName').value
    this.setStatus('Initiating transaction... (please wait)')
    if (id == ""){
      alert("Please enter transaction id")
      return
    }
    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount,name,id, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },
  getCurrentLocation: function(){
    let meta
    MetaCoin.deployed().then(function (instance){
      meta = instance
      meta.GetTrailCount.call({ from: account }).then(function(value){
        var s = value.valueOf()
        alert("Current Transaction Number:- "+s)
        meta.GetLocation.call(s-1,{ from: account }).then( function(returnValues){
          //alert(returnValues)
          document.getElementById("receiver").value= returnValues[2]
          document.getElementById("amount").value = returnValues[1]
          document.getElementById("locationName").value = returnValues[0]
      })
     
        }).catch(function(e) {
         console.log(e)
        })
      })
      
    // })
   
  }
  
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
