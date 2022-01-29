const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://api.waxsweden.org',
    tryAutoLogin: true,
    waxSigningURL: "https://all-access.wax.io",
    waxAutoSigningURL: "https://api-idm.wax.io/v1/accounts/auto-accept/"
});
async function Waxlogin() {
    try {
        const userWAX = await wax.login();
        document.getElementById("Name_Login").innerText = userWAX;
        console.log("LOGIN SUCCESS!");
    } catch (e) {
		console.log("Error Login")
    }
}

const {TaskTimer} = tasktimer;
const fwRepair = 0.35;
const fwRecover = 450;
async function toolsClaim() {
		
		console.clear();
		
		const userWAX = document.getElementById("Name_Login").innerText;
		const balance = await getTableRows("farmersworld", "accounts", userWAX);
		let new_Balance = [];
		try {
			balance.balances.forEach(element => {
				let k = element.toString().slice(-4);
				if (k === "WOOD") {
					new_Balance[0] = (element);
				} else if (k === "FOOD") {
					new_Balance[2] = (element);
				} else if (k === "GOLD") {
					new_Balance[1] = (element);
				} else {}
				balance.balances = new_Balance;
			});
		} catch (e) {}
		const token_balance = await getTableRowsToken("farmerstoken","accounts",userWAX,1000);
		const fees = await getTableRows("farmersworld", "config","");

		try{
		document.getElementById("FWW_2").innerText = balance.balances[0];
		document.getElementById("FWF_2").innerText = balance.balances[2];
		document.getElementById("FWG_2").innerText = balance.balances[1];
		
		document.getElementById("FWW_1").innerText = token_balance[2].balance;
		document.getElementById("FWF_1").innerText = token_balance[0].balance;
		document.getElementById("FWG_1").innerText = token_balance[1].balance;
		
		document.getElementById("FW_Fee").innerText = fees.fee+" %";
		}catch(e){}
		
		let FWW = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://wax.alcor.exchange/api/markets/104/')}`)
						.then(response => response.json());
		FWW = JSON.parse(FWW.contents);
		  
		let FWF = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://wax.alcor.exchange/api/markets/105/')}`)
						.then(response => response.json());
		FWF = JSON.parse(FWF.contents);
		  
		let FWG = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://wax.alcor.exchange/api/markets/106/')}`)
						.then(response => response.json());
		FWG = JSON.parse(FWG.contents);
		
		document.getElementById("FWW_Price").innerText = parseFloat(FWW.last_price).toFixed(4);
		document.getElementById("FWF_Price").innerText = parseFloat(FWF.last_price).toFixed(4);
		document.getElementById("FWG_Price").innerText = parseFloat(FWG.last_price).toFixed(4);
		
		document.getElementById("energy").innerHTML = 'Tools '+'<span class="badge bg-info">'+balance.energy + ' / ' + balance.max_energy+'</span>'
		const getIndex_Tools = await getTableRows_byIndex("farmersworld", "tools", userWAX, '2', 'name');
	
	try {
            document.querySelectorAll(".addTools").forEach(e => e.remove());
            document.querySelectorAll(".addMbs").forEach(e => e.remove());
			document.querySelectorAll(".addCrops").forEach(e => e.remove());
        } catch (err) {}
    getIndex_Tools.forEach(async element => {
        let asset_name = 'xxx';
        let wax_reward = 0;
        let food_use = 0;
        let gold_use = 0;
        switch (element.template_id) {
        case 203886:
            asset_name = 'CHAINSAW';
            wax_reward = 54;
            food_use = 12;
            gold_use = 9;
            break;
        case 203883:
            asset_name = 'SAW';
            wax_reward = 17;
            food_use = 6;
            gold_use = 3;
            break;
        case 203881:
            asset_name = 'AXE';
            wax_reward = 5;
            food_use = 2;
            gold_use = 1;
            break;
        case 203887:
            asset_name = 'FISHING ROD';
            wax_reward = 5;
            food_use = 0;
            gold_use = 1;
            break;
        case 203888:
            asset_name = 'FISHING NET';
            wax_reward = 20;
            food_use = 0;
            gold_use = 4;
            break;
        case 203889:
            asset_name = 'FISHING BOAT';
            wax_reward = 80;
            food_use = 0;
            gold_use = 7;
            break;
        case 203891:
            asset_name = 'MINING EXCAVATOR';
            wax_reward = 50;
            food_use = 27 / 2;
            gold_use = 0.5;
            break;
        case 260763:
            asset_name = 'STONE AXE';
            wax_reward = 1.7;
            food_use = 1;
            gold_use = 0.6;
            break;
        case 378691:
            asset_name = 'ANCIENT STONE AXE';
            wax_reward = 0.35;
            food_use = 0.4;
            gold_use = 0.1;
            break;
        default:
        }
        addTableTools(asset_name, +element.current_durability + ' / ' + element.durability, sec2time(element.next_availability - Date.now() / 1000));
        if (element.next_availability - Date.now() / 1000 < 0) {
            let config = {
                actions: [{
                        account: 'farmersworld',
                        name: 'claim',
                        authorization: [{
                                actor: userWAX,
                                permission: 'active',
                            }
                        ],
                        data: {
                            owner: userWAX,
                            asset_id: element.asset_id
                        },
                    }
                ]
            };
            let ret = await sign(config);
            if (ret == true) {
                console.log('Claim Tool SUCCESS!');
                $.ajax({
                    type: "POST",
                    url: "/submit",
                    data: {
                        detail: '💸 Claim Tool SUCCESS!\n' + asset_name + '\n' + 'Durability:' + element.current_durability + ' / ' + element.durability + '\n' + 'Energy:' + balance.energy + '/' + balance.max_energy
                    }
                });
            } else {
                console.log('Claim Tool FAILED!');
            }
        }
        if ((element.current_durability / element.durability) <= fwRepair) {
            const current_gold = balance.balances[2].split(" ")[0];
            let goldNeed = (element.durability - element.current_durability) / 5;
            if (goldNeed > current_gold) {
                $.ajax({
                    type: "POST",
                    url: "/submit",
                    data: {
                        detail: 'FW => Need more 💰\n' + current_gold + 'remains!' + '\n' + 'current_durability:' + element.current_durability + '/' + element.durability
                    }
                });
                return;
            }
            let config = {
                actions: [{
                        account: 'farmersworld',
                        name: 'repair',
                        authorization: [{
                                actor: userWAX,
                                permission: 'active',
                            }
                        ],
                        data: {
                            asset_owner: userWAX,
                            asset_id: element.asset_id
                        },
                    }
                ]
            };
            let ret = await sign(config);
            if (ret == true) {
                console.log('REPAIR SUCCESS!');
            } else {
                console.log('REPAIR FAILED!');
            }
        }
    });
    try {
        const getIndex_Mbs = await getTableRows_byIndex("farmersworld", "mbs", userWAX, '2', 'name');
        getIndex_Mbs.forEach(async element => {
            let asset_name = 'xxx';
            switch (element.template_id) {
            case 260628:
                asset_name = 'BRONZE MEMBER 🪵';
                break;
            case 260629:
                asset_name = 'SILVER MEMBER 🪵';
                break;
            case 260631:
                asset_name = 'GOLD MEMBER 🪵';
                break;
            case 260635:
                asset_name = 'DIAMOND MEMBER 🪵';
                break;
            case 260636:
                asset_name = 'BRONZE MEMBER 🐟';
                break;
            case 260638:
                asset_name = 'SILVER MEMBER 🐟';
                break;
            case 260639:
                asset_name = 'GOLD MEMBER 🐟';
                break;
            case 260641:
                asset_name = 'DIAMOND MEMBER 🐟';
                break;
            case 260642:
                asset_name = 'BRONZE MEMBER 💰';
                break;
            case 260644:
                asset_name = 'SILVER MEMBER 💰';
                break;
            case 260647:
                asset_name = 'GOLD MEMBER 💰';
                break;
            case 260648:
                asset_name = 'DIAMOND MEMBER 💰';
                break;
            default:
            }
            addTableMbs(asset_name, sec2time(element.next_availability - Date.now() / 1000));
            if (element.next_availability - Date.now() / 1000 < 0) {
                let config = {
                    actions: [{
                            account: 'farmersworld',
                            name: 'mbsclaim',
                            authorization: [{
                                    actor: userWAX,
                                    permission: 'active',
                                }
                            ],
                            data: {
                                owner: userWAX,
                                asset_id: element.asset_id
                            },
                        }
                    ]
                };
                let ret = await sign(config);
                if (ret == true) {
                    console.log('Claim MBS SUCCESS!');
                    $.ajax({
                        type: "POST",
                        url: "/submit",
                        data: {
                            detail: '💸 Claim MBS SUCCESS!\n' + asset_name + '\n' + 'Energy:' + balance.energy + '/' + balance.max_energy
                        }
                    });
                } else {
                    console.log('Claim MBS FAILED!');
                }
            }
        });
    } catch (err) {}
	
	try{
		const balance = await getTableRows("farmersworld", "accounts", userWAX);
		if (balance.energy < fwRecover) {
			const current_food = parseInt(balance.balances[2].split(".")[0]);
			let recover = current_food * 5;
			if (recover == 0) {
				$.ajax({
					type: "POST",
					url: "/submit",
					data: {
						detail: 'FW' + '=>' + 'Need more' + '🐟\n' + current_food + 'remains!' + '\n' + 'Energy' + balance.energy + ' / ' + balance.max_energy
					}
				});
				return;
			}
			if (recover > balance.max_energy)
				recover = balance.max_energy - balance.energy;
			let config = {
				actions: [{
						account: 'farmersworld',
						name: 'recover',
						authorization: [{
								actor: userWAX,
								permission: 'active',
							}
						],
						data: {
							owner: userWAX,
							energy_recovered: recover
						},
					}
				]
			};
			let ret = await sign(config);
			if (ret == true) {
				console.log('energy, RECOVER SUCCESS!');
			} else {
				console.log('RECOVER FAILED!');
			}
		}
	}catch(e){}
	
	try {
        const getIndex_Crops = await getTableRows_byIndex("farmersworld", "crops", userWAX, '2', 'name');
        getIndex_Crops.forEach(async element => {
            let asset_name = 'xxx';
            switch (element.template_id) {
            case 298595:
                asset_name = 'Barley Seed ';
                break;
            case 298596:
                asset_name = 'Corn Seed';
                break;
            default:
            }
			addTableCrops(asset_name,element.times_claimed,sec2time(element.next_availability - Date.now() / 1000));
            if (element.next_availability - Date.now() / 1000 < 0) {
                let config = {
                    actions: [{
                            account: 'farmersworld',
                            name: 'cropclaim',
                            authorization: [{
                                    actor: userWAX,
                                    permission: 'active',
                                }
                            ],
                            data: {
                                owner: userWAX,
                                crop_id: element.asset_id
                            },
                        }
                    ]
                };
                let ret = await sign(config);
                if (ret == true) {
                    console.log('Crop Claim SUCCESS!');
                    $.ajax({
                        type: "POST",
                        url: "/submit",
                        data: {
                            detail: '💸 Crop Claim SUCCESS!\n' + asset_name + '\n' + 'Energy:' + balance.energy + '/' + balance.max_energy
                        }
                    });
                } else {
                    console.log('Crop Claim FAILED!');
                }
            }
        });
    } catch (err) {}
}
    
async function getTableRows(code, tableName, bound, limit = 1) {
    if (typeof(code) != "string" || typeof(bound) != "string" || typeof(tableName) != "string") {
        return false;
    }
    let result;
    try {
        result = await wax.api.rpc.get_table_rows({
            json: true,
            code: code,
            scope: code,
            table: tableName,
            lower_bound: bound,
            upper_bound: bound,
            limit: limit,
            reverse: false,
            show_payer: false
        });
		return result.rows[0];
    } catch (e) {
        
    }
}

async function getTableRowsToken(code, tableName, scope, limit = 1000) {
    if (typeof(code) != "string" || typeof(scope) != "string" || typeof(tableName) != "string") {
        return false;
    }
    let result;
    try {
        result = await wax.api.rpc.get_table_rows({
            json: true,
            code: code,
            scope: scope,
            table: tableName,
            limit: limit,
			reverse: false
        });
		return result.rows;
    } catch (e) {
        
    }
}

async function addTableTools(nameOfTool, durabilityOfTool, timeClaimOfTool) {
    let addTool = '<tr class=' + 'addTools' + '>' + '<td>' + nameOfTool + '</td>' + '<td>' + durabilityOfTool + '</td>' + '<td>' + timeClaimOfTool + '</td>' + '</tr>';
    document.getElementById('Tools').innerHTML +=(addTool);
}
async function addTableMbs(nameOfMbs, timeClaimOfMbs) {
    let addMbs = '<tr class=' + 'addMbs' + '>' + '<td>' + nameOfMbs + '</td>' + '<td>- - -</td>' + '<td>' + timeClaimOfMbs + '</td>' + '</tr>';
    document.getElementById('Tools').innerHTML +=(addMbs);
}
async function addTableCrops(nameOfCrops,Cliamed, timeClaimOfCrops) {
	let img='';
	if(nameOfCrops="Barley Seed"){
		img="img/barley2.png>";
	}else{
		img="img/corn2.png>";
	}
    let addCrops = '<tr class=' + 'addCrops' + '>' + '<td>'+'<img src='+img+'</img>' + nameOfCrops + '</td>' + '<td>'+ Cliamed +' / 42'+'</td>' + '<td>' + timeClaimOfCrops + '</td>' + '</tr>';
    document.getElementById('Crops').innerHTML +=(addCrops);
}
async function getTableRows_byIndex(code, tableName, bound, index, key_type) {
    if (typeof(code) != "string" || typeof(bound) != "string" || typeof(tableName) != "string" || typeof(index) != "string" || typeof(key_type) != "string") {
        return false;
    }
    let result;
    try {
        result = await wax.api.rpc.get_table_rows({
            json: true,
            code: code,
            scope: code,
            table: tableName,
            index_position: index,
            key_type: key_type,
            lower_bound: bound,
            upper_bound: bound,
            reverse: false,
        });
		return result.rows;
    } catch (e) {
        
    }
}
async function sign(configTranscat) {
    if (!wax.api) {
        return console.log("Login first");
    }
    try {
        const result = await wax.api.transact(configTranscat, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
    } catch (e) {
        $.ajax({
            type: "POST",
            url: "/submit",
            data: {
                detail: 'FW' + '=>' + '❌ ❌ ❌' + '\n' + 'transaction fail' + '!!!!\n msg : ' + e.message
            }
        });
        return e.message;
    }
}
async function getCurrentMessage() {
    const res = await wax.rpc.get_table_rows({
        json: true,
        code: 'test.wax',
        scope: 'test.wax',
        table: 'messages',
        lower_bound: wax.userAccount,
        upper_bound: wax.userAccount,
    });
    console.log(`test current ${res.rows[0]}`);
    const message = res.rows[0] ? res.rows[0].message : `<No message is set for ${wax.userAccount}>`;
    document.getElementById('current').textContent = message;
}
function sec2time(timeInSeconds) {
    var pad = function (num, size) {
        return ('000' + num).slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}
const timerMain = new TaskTimer(1000);
timerMain.add([{
            id: 'FW_Tools',
            tickInterval: 20,
            totalRuns: 0,
            callback(task) {
                console.log(`${task.id}:Running..`);
                toolsClaim()
            }
        }
    ]);
	
async function Withdraw(){
	
	const select = document.getElementById('FW_Withdraw');
	const option = select.options[select.selectedIndex];
	
	const withdraw_value = document.getElementById("withdraw_input").value;
	const userWAX = document.getElementById("Name_Login").innerText;
	
	let str = withdraw_value+'.0000'+' '+option.value;
	let config = {
                    actions: [{
                            account: 'farmersworld',
                            name: 'withdraw',
                            authorization: [{
                                    actor: userWAX,
                                    permission: 'active',
                                }
                            ],
                            data: {
								fee: 5,
                                owner: userWAX,
								quantities: [str]
                            },
                        }
                    ]
                };
                let ret = await sign(config);
                if (ret == true) {
                    console.log('Withdraw SUCCESS!');
                    $.ajax({
                        type: "POST",
                        url: "/submit",
                        data: {
                            detail: '💸 Withdraw SUCCESS!\n'
                        }
                    });
					document.getElementById("withdraw_input").value = "..."
					option.value = FWW;
                } else {
                    console.log('Withdraw FAILED!');
                }          
}

async function Deposit(){
	
	const select = document.getElementById('FW_Deposit');
	const option = select.options[select.selectedIndex];
	
	const deposit_value = document.getElementById("deposit_input").value;
	const userWAX = document.getElementById("Name_Login").innerText;
	
	let str = deposit_value+'.0000'+' '+option.value;
	let config = {
                    actions: [{
                            account: 'farmerstoken',
                            name: 'transfers',
                            authorization: [{
                                    actor: userWAX,
                                    permission: 'active',
                                }
                            ],
                            data: {
								from: userWAX,
								memo: "deposit",
								quantities: [str],
								to: "farmersworld"
                            },
                        }
                    ]
                };
                let ret = await sign(config);
                if (ret == true) {
                    console.log('Deposit SUCCESS!');
                    $.ajax({
                        type: "POST",
                        url: "/submit",
                        data: {
                            detail: '💸 Deposit SUCCESS!\n'
                        }
                    });
					document.getElementById("deposit_input").value = "..."
					option.value = FWW;
                } else {
                    console.log('Deposit FAILED!');
                }          
}

async function Burn(){
	const userWAX = document.getElementById("Name_Login").innerText;
	let config = {
                    actions: [{
                            account: 'atomicassets',
                            name: 'transfer',
                            authorization: [{
                                    actor: userWAX,
                                    permission: 'active',
                                }
                            ],
                            data: {
								asset_ids: ["1099616646508"],
								from: userWAX,
								memo: 'burn',
								to:'farmersworld'
                            },
                        }
                    ]
                };
                let ret = await sign(config);
                if (ret == true) {
                    console.log('Burn SUCCESS!');
                    $.ajax({
                        type: "POST",
                        url: "/submit",
                        data: {
                            detail: '💸 Burn SUCCESS!\n'
                        }
                    });
                } else {
                    console.log('Burn FAILED!');
                }          
}