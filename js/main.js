new Vue({
    el: '#app',
    data: {
        web3    : null,
        contract: null,
        age     : 0,
        newAge  : '',
        loaded  : false,
        message : '',
        error   : null
    },
    methods: {
        // get stored age from the blockchain
        getAge() {
            this.message = 'Getting data from blockchain...';
            this.contract.methods.getAge().call()
            .then(age => {
                this.age     = age;
                this.loaded  = true;
                this.message = '';
                this.newAge  = '';
            })
            .catch(error => {
                this.error = error;
            });
        },

        // modify age in the blockchain
        setAge() {
            window.ethereum.enable()
            .then(response => {
                this.web3.eth.getAccounts()
                .then(accounts => {
                    this.loaded  = false;
                    this.message = 'Writing data to blockchain...';
                    return this.contract.methods.setAge(parseInt(this.newAge)).send({
                        from: accounts[0]
                    })
                    .then(response => {
                        console.log('SUCCESS: ', response);
                        this.getAge();
                    })
                    .catch(error => {
                        this.error = error;
                    });
                })
                .catch(error => {
                    this.error = error;
                });
            })
            .catch(error => {
                this.error = error;
            })
        }
    },
    created() {
        // initialize web3 object
        this.web3 = new Web3(window.ethereum);

        // initialize address and abi
        let address = '0x9c86914b393AB7eCf2734E91967AA459555Fc93c';
        let abi     = [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_age",
                        "type": "uint256"
                    }
                ],
                "name": "setAge",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getAge",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        // initialize contract
        this.contract = new this.web3.eth.Contract(abi, address);

        // call getAge()
        this.getAge();
    }
});