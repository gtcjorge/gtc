// ==UserScript==
// @name         GTC Toolkit
// @namespace    http://www.globaltrainingcenter.com/
// @version      3.3
// @description  Tools
// @author       Jorge Dominguez
// @copyright    2017, gtcjorge (https://openuserjs.org/users/gtcjorge)
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @include      https://na8.salesforce.com/00T/e?who_id=*
// @include      https://na8.salesforce.com/home/home.jsp
// @include      https://na8.salesforce.com/01ZC00000013c3z
// @include      https://na8.salesforce.com/*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @require      http://globaltrainingcenter.com/date.js
// @updateURL    https://github.com/gtcjorge/gtc/raw/master/gtctoolkit.user.js
// @downloadURL  https://github.com/gtcjorge/gtc/raw/master/gtctoolkit.user.js
// @connect      www.globaltrainingcenter.com
// @connect      globaltrainingcenter.com
// @connect      login.salesforce.com
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

const pw = '4egtc550';
const classesfound = [];
const dict = [];
dict['Export to Canada'] = 'Export to Canada';
dict['Export Canada'] = 'Export to Canada';
dict['Export to Mexico'] = 'Export to Mexico';
dict['Export Mexico'] = 'Export to Mexico';
dict.Exporting = 'Export Documentation';
dict.Export = 'Export Documentation';
dict['Import Focused Assessment(Audit)'] = 'Import Audit Compliance';
dict.Importing = 'Import Documentation';
dict.Import = 'Import Documentation';
dict['Incoterms 2010 Rules'] = 'Incoterms';
dict.Incoterms = 'Incoterms';
dict['Incoterms Strategies'] = 'Incoterms Strategies';
dict['International Logistics'] = 'International Logistics';
dict['Int\'l Logistics'] = 'International Logistics';
dict['Letters of Credit'] = 'Letters of Credit';
dict['Letters Credit'] = 'Letters of Credit';
dict['Making C-TPAT Work for You'] = 'Road to C-TPAT Certification';
dict.CTPAT = 'Road to C-TPAT Certification';
dict['NAFTA Rules of Origin'] = 'NAFTA Rules of Origin';
dict.NAFTA = 'NAFTA Rules of Origin';
dict['Tariff Classification'] = 'Tariff Classification';
dict['Trans Pacific Partnership'] = 'TPP';
dict['Trans Pacific Partnership Dec 15....NEW'] = 'TPP';
dict['Importing 201'] = 'Importing 201';
dict['Import 201'] = 'Importing 201';
dict.Tariff = 'Tariff Classification';

const classes = [];
const instructors = [];
instructors['Arthur O\'Meara'] = 'AO';
instructors['Arthur O&#039;Meara'] = 'AO';
instructors['Catherine J Petersen'] = 'CP';
instructors['Darie Achstein-Conway'] = 'DA';
instructors['John Goodrich'] = 'JG';
instructors['Michael Laden'] = 'ML';
instructors['Paul Patterson'] = 'PP';
instructors['George W Thompson'] = 'GT';
instructors['Trudy Wilson'] = 'TW';

let injected = 0;
let requestedpassword = false;

function watermark() {
	const scriptversion = GM_info.script.version;
	let tab = $('#AllTab_Tab').after('<li id="scriptversion"><li>');
	tab = $('#scriptversion');
	tab.css('color', '#0068B3');
	tab.css('border', '3px solid #0068B3');
	tab.css('font-weight', 'bold');
	tab.text(`GTC Script: v${scriptversion}`);
}

function fIns(inst) {
	return instructors[inst];
}

function fTime(halforfull, type) {
	let rtime;
	if (halforfull === 'full') {
		if (type === 'seminar') {
			rtime = '8:30am-4pm';
		}
		if (type === 'webinar') {
			rtime = '8:30am-4pm CST';
		}
	}
	if (halforfull === 'half') {
		if (type === 'seminar') {
			rtime = '8:30am-Noon';
		}
		if (type === 'webinar') {
			rtime = '9:00am-12:30pm CST';
		}
	}
	return rtime;
}

function sfsubject(co) {
	const c = [];
	c[0] = co.Venue;
	c[1] = co['Event Title'];
	c[2] = co['Event Desc'];
	c[3] = co.Venue;
	c[4] = co['Venue Address'];
	c[5] = co['Event Date'];
	c[6] = co.Time;
	c[7] = co.Cost;
	c[8] = co.City;
	c[9] = co['Original Event Date'];
	c[10] = co.Seminar;
	c[11] = co.Webinar;
	c[12] = co.Country;
	c[13] = co.Link;
	c[14] = co.Notes;
	c[15] = co['Hotel Link'];
	c[16] = co.Instructor;
	// class info
	let classname;
	let cityname;
	let description;
	let halforfull;
	let type;
	type = 'seminar';
	// class info

	if (c[0] === 'Webinar' || c[8] === 'Webinar') {
		type = 'webinar';
	}

	if (c[1] === 'International Logistics') {
		halforfull = 'full';
		classname = 'Trans';
	} else if (c[1] === 'Incoterms') {
		halforfull = 'half';
		classname = 'Inco';
	} else if (c[1] === 'Export Documentation') {
		classname = 'Export';
		halforfull = 'full';
	} else if (c[1] === 'Tariff Classification') {
		halforfull = 'full';
		classname = 'Tariff';
	} else if (c[1] === 'NAFTA Rules of Origin') {
		halforfull = 'full';
		classname = 'NAFTA';
	} else if (c[1] === 'Import Documentation') {
		halforfull = 'full';
		classname = 'Import';
	} else if (c[1] === 'Import Audit Compliance') {
		halforfull = 'full';
		classname = 'Audit';
	} else if (c[1] === 'Incoterms Strategies') {
		halforfull = 'half';
		classname = 'Inco';
	} else if (c[1] === 'Letters of Credit') {
		halforfull = 'full';
		classname = 'LC';
	} else if (c[1] === 'TPP') {
		halforfull = 'full';
		classname = 'TPP';
	} else if (c[1] === 'Export to Canada') {
		halforfull = 'half';
		classname = 'Canada';
	} else if (c[1] === 'Importing 201') {
		halforfull = 'full';
		classname = 'Import 201';
	} else if (c[1] === 'Road to C-TPAT Certification') {
		halforfull = 'half';
		classname = 'C-TPAT';
	} else if (c[1] === 'Export to Mexico') {
		halforfull = 'half';
		classname = 'Mexico';
	}

	if (c[3] === 'Webinar') {
		cityname = 'Webinar';
		type = 'webinar';
	} else {
		[cityname] = c[3].split(', ');
	}

	$('#tsk5').val(`${cityname} ${classname}`).css('border', '3px solid green');


	switch (c[1]) {
	case 'Import Audit Compliance':
		description = 'Import Focused Assessment';
		break;
	case 'Incoterms':
		description = 'International Terms';
		break;
	case 'Incoterms Strategies':
		description = 'International Terms Strategies';
		break;
	case 'Letters of Credit':
		description = 'International Letters of Credit';
		break;
	case 'Road to C-TPAT Certification':
		description = 'Road to C-TPAT';
		break;
	case 'TPP':
		description = 'Trans Pacific Partnership';
		break;
	default:
		[, description] = c;
		break;
	}

	const classdate = Date.parse(c[5]);
	const today = new Date();
	const datefield = classdate.toString('MM/dd/yyyy');
	const registrationfield = today.toString('MM/dd/yyyy');
	const testdate = (1).months().fromNow();
	let price = -1;
	if (classdate >= testdate) {
		if (halforfull === 'full') {
			price = '545';
		}
		if (halforfull === 'half') {
			price = '345';
		}
	} else {
		if (halforfull === 'full') {
			price = '595';
		}
		if (halforfull === 'half') {
			price = '395';
		}
	}

	const hoursfield = fTime(halforfull, type);


	const ins = fIns(c[16]);

	$('option').filter((i, e) => $(e).val() === ins).prop('selected', true).parent()
		.css('border', '3px solid green');
	$('option').filter((i, e) => $(e).val() === description).prop('selected', true).parent()
		.css('border', '3px solid green');
	$('option').filter((i, e) => $(e).val() === hoursfield).prop('selected', true).parent()
		.css('border', '3px solid green');
	$('#00N80000004fJvF').val(price).css('border', '3px solid green');
	$('#00N80000004fJvU').val(registrationfield).css('border', '3px solid green');
	$('#tsk4').val(datefield).css('border', '3px solid green');
}

function insertclass(classo) {
	sfsubject(classo);
}

function getkey(callback) {
	if (requestedpassword === true) return;
	console.log('getting key');
	GM_xmlhttpRequest({
		method: 'POST',
		url: 'https://login.salesforce.com/services/oauth2/token',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: `grant_type=password&client_id=3MVG9CVKiXR7Ri5oTacFEDc70dveabo7ofE9G1sr_6XO03Qk1mM9Hq1StahY9EqbOsBhcm3PEb6FzhkW3HVKz&client_secret=4221779451511459233&username=team%40globaltrainingcenter.com&password=${pw}`,
		onload(response) {
			// console.log(response);
			requestedpassword = true;
			const jr = JSON.parse(response.responseText);
			const token = jr.access_token;
			console.log(token);
			GM_setValue('token', token);
			callback();
		},
	});
}

function go() {
	const id = $('#who_id').attr('value');
	const me = this;
	const urlr = `https://na8.salesforce.com/services/data/v38.0/query/?q=SELECT Name from pymt__Shopping_Cart_Item__c WHERE pymt__Contact__c = '${id}' AND CreatedDate = LAST_N_DAYS:60`;
	const urlcontactquery = `https://na8.salesforce.com/services/data/v38.0/query/?q=SELECT Order_Source__c from Contact WHERE Id = '${id}'`;

	// bring in order source
	GM_xmlhttpRequest({
		method: 'get',
		url: urlcontactquery,
		headers: {
			Authorization: `OAuth ${GM_getValue('token')}`,
			'Content-Type': 'application/json',
		},
		onload(response) {
			// console.log(response);
			if (response.status === 200) {
				const json = JSON.parse(response.responseText);
				// console.log(json);
				if (json && json.totalSize === 1) {
					const source = json.records[0].Order_Source__c;
					// console.log(source);
					let tsource = source;
					if (source === 'CoWorker') tsource = 'Co-Worker';
					if (source === 'WebSearch') tsource = 'Web Search';
					$('option').filter((i, e) => $(e).val() === tsource).prop('selected', true).parent()
						.css('border', '3px solid green');
				}
			}
		},
	});
	// finish bring in order source

	// get shopping cart items
	GM_xmlhttpRequest({
		method: 'get',
		url: urlr,
		headers: {
			Authorization: `OAuth ${GM_getValue('token')}`,
			'Content-Type': 'application/json',
		},
		onload(response) {
			if (response.status === 200) {
				$('#head_1_ep').next().find('tbody').prepend('<tr id=\'itemsrow\'><td class=\'labelCol\'><label for=\'00N80000004fJvF\'>Items</label></td><td class=\'dataCol col02\'><select id=\'classes\'></select></td></tr>');
				$('#classes').append('<option id=\'blank\'></option>');
				$('#classes').on('change', (k) => {
					if (!$(k.target).find(':selected').val() || $(k.target).find(':selected').val() === '') {
						return;
					}
					let cdate = $(k.target).find(':selected').val().split(' - ')[1];
					if (cdate.split(' ').length > 2) {
						const splits = cdate.split(' ');
						cdate = `${splits[0]} ${splits[1]}`;
					}
					const classselected = `${dict[$(k.target).find(':selected').val().split(' - ')[0]]} - ${cdate}`;
					console.log(`http://www.globaltrainingcenter.com/classapi.php?sf=${classselected}`);
					GM_xmlhttpRequest({
						method: 'GET',
						url: `http://www.globaltrainingcenter.com/classapi.php?sf=${classselected}`,
						onload(response2) {
							if (response2.status === 200) {
								// console.log(response2.responseText);
								const json = JSON.parse(response2.responseText);
								// console.log(json);
								if (!json.length || json.length < 1) {
									alert('No results please enter manually');
								}
								if (json.length === 1) {
									insertclass(json[0]);
								}
								if (json.length > 1) {
									// console.log(json);
									$('#itemsrow').after('<tr><td class=\'labelCol\'><label for=\'00N80000004fJvF\'>Classes found</label></td><td class=\'dataCol col02\'><select id=\'classesfound\'></select></td></tr>');
									$('#classesfound').append('<option id=\'blank\'></option>');
									$('#classesfound').on('change', (i) => {
										const selectbox = $(i.target);
										if (!$(selectbox).find(':selected').val() || $(selectbox).find(':selected').val() === '') {
											return;
										}
										const idfound = $(selectbox).find(':selected').attr('id');
										insertclass(json[idfound]);
									});
									for (let x = 0; x < json.length; x += 1) {
										classesfound[x] = json[x];
										$('#classesfound').append(`<option id='${x}'>${json[x]['Event Title']} - ${json[x].Venue} - ${json[x]['Event Date']}</option>`);
									}
								}
							} else {
								console.error(response2.responseText);
							}
						},
					});
				});
				const json = JSON.parse(response.responseText);
				$(json.records).each((index, item) => {
					let name = item.Name.split('-')[0];
					const date = item.Name.split('-')[1];
					if (name.split('Session: ')[1]) [, name] = name.split('Session: ');
					console.log(name);
					const classo = {
						name,
						date,
					};
					if (dict[name]) {
						classes[index] = classo;
						$('#classes').append(`<option id='${index}'>${classo.name} - ${classo.date}</option>`);
					}
				});
			} else {
				// alert("Error: "+response.responseText);
				console.error(response.responseText);
				let needsession = false;
				const ec = JSON.parse(response.responseText)[0].errorCode;
				console.log(ec);
				if (ec === 'INVALID_SESSION_ID') {
					needsession = true;
				}
				if (needsession) {
					getkey(me);
				}
			}
		},
	});
	if (injected === 1) return;

	$('#head_1_ep').next().find('tbody').prepend('<tr id=\'itemsrow\'><td class=\'labelCol\'><label for=\'00N80000004fJvF\'>Other ID</label></td><td class=\'dataCol col02\'><input type=\'text\' id=\'otherid\' /></td></tr>');

	$('#otherid').on('change', (k) => {
		const otherid = $(k.target).val().trim();
		GM_xmlhttpRequest({
			method: 'GET',
			headers: {
				Authorization: `OAuth ${GM_getValue('token')}`,
				'Content-Type': 'application/json',
			},
			url: `https://na8.salesforce.com/services/data/v38.0/query/?q=SELECT Id,Subject FROM Task where WhoId = '${otherid}' and Seminar_Price__c != NULL`,
			onload(response) {
				if (response.status === 200) {
					// console.log(response.responseText);
					$('#otherid').parent().parent().next()
						.before('<tr><td class=\'labelCol\'><label for=\'00N80000004fJvF\'>Clone Task</label></td><td class=\'dataCol col02\'><select id=\'tasksfromotherid\'><option></option></select></td></tr>');
					const json = JSON.parse(response.responseText);
					for (let i = 0; i < json.records.length; i += 1) {
						// alert(json.records[i].Subject);
						const r = json.records[i];
						$('#tasksfromotherid').append(`<option id='${r.Id}'>${r.Subject}</option>`);
					}
					$('#tasksfromotherid').on('change', () => {
						// https://na8.salesforce.com/services/data/v38.0/sobjects/Task/00TC000005D1RLjMAN
						const id2 = $('#tasksfromotherid option:selected').attr('id');
						const tok = GM_getValue('token');
						GM_xmlhttpRequest({
							method: 'GET',
							headers: {
								Authorization: `OAuth ${tok}`,
							},
							url: `https://na8.salesforce.com/services/data/v38.0/sobjects/Task/${id2}`,
							onload(response3) {
								if (response3.status === 200) {
									const json2 = JSON.parse(response3.responseText);
									const duedate = Date.parse(json2.ActivityDate).toString('MM/dd/yyyy');
									$('#tsk5').val(json2.Subject).css('border', '3px solid green');
									$('#00NC0000005CE6d > option').filter((i, e) => $(e).val() === json2.Seminar_Description__c).prop('selected', true).parent()
										.css('border', '3px solid green');
									$('#00N80000004fJvF').val(json2.Seminar_Price__c).css('border', '3px solid green');
									$('#00N80000004fK21 > option').filter((i, e) => $(e).val() === json2.Instructor__c).prop('selected', true).parent()
										.css('border', '3px solid green');
									$('#00NC0000005CEDy > option').filter((i, e) => $(e).val() === json2.Seminar_Hours__c).prop('selected', true).parent()
										.css('border', '3px solid green');
									const today = Date.parse('today').toString('MM/dd/yyyy');
									$('#00N80000004fJvU').val(today).css('border', '3px solid green');
									$('#tsk4').val(duedate).css('border', '3px solid green');
								}
							},
						});
					});
				}
			},
		});
	});

	watermark();

	injected = 1;
}

function ks() {
	// console.log(tok);
	const me = this;
	const today = Date.today();
	const todayplus30 = today.clone().addDays(30);
	// console.log({ today, todayplus30 });
	GM_xmlhttpRequest({
		method: 'get',
		url: 'https://na8.salesforce.com/services/data/v42.0/query/?q=SELECT Id, Name, evt__Start__c, evt__Session_Fee__c from evt__Session__c WHERE evt__Start__c > TODAY AND evt__Start__c <= NEXT_N_MONTHS:2 order by evt__Start__c asc',
		headers: {
			Authorization: `OAuth ${GM_getValue('token')}`,
			'Content-Type': 'application/json',
		},
		onload(response) {
			if (response.status === 200) {
				const json = JSON.parse(response.responseText);
				const wrongsessions = [];
				$(json.records).each((index, item) => {
					// console.log(item);
					const completeurl = `https://na8.salesforce.com/${item.Id}`;
					const session = {
						id: item.Id,
						name: item.Name,
						url: completeurl,
						date: Date.parse(item.evt__Start__c.split('T')[0]),
						currentcost: item.evt__Session_Fee__c,
						correctcost: item.evt__Session_Fee__c,
					};
					if (session.date < todayplus30) {
						if (session.currentcost === 545 || session.currentcost === 345) {
							session.correctcost = session.currentcost + 50;
							wrongsessions.push(session);
						}
					}
				});
				if (wrongsessions.length > 0) {
					$('#section_header').parent().append('<div id="wrongsessions" class="metadata"></div>');
					$('#wrongsessions').css({
						border: '3px solid red',
						padding: '5px',
						background: 'linear-gradient(#f48181, #ffbaba)',
					});
					$(wrongsessions).each((i, e) => {
						GM_xmlhttpRequest({
							method: 'PATCH',
							headers: {
								Authorization: `OAuth ${GM_getValue('token')}`,
								'Content-Type': 'application/json',
							},
							url: `https://na8.salesforce.com/services/data/v42.0/sobjects/evt__Session__c/${e.id}`,
							data: JSON.stringify({
								evt__Session_Fee__c: e.correctcost,
							}),
							onload(a) {
								console.log(a);
								if (a && a.status === 204) {
									$('#wrongsessions').append(`<div><a href="${e.url}">${e.name}</a> had the wrong cost (${e.currentcost} was updated to ${e.correctcost}) (${e.date.toString('d-MMM-yyyy')})<div>`);
								}
							},
						});
					});
				} else {
					console.log('no events with wrong pricing :)');
				}
			} else {
				console.error(response.responseText);
				let needsession = false;
				const ec = JSON.parse(response.responseText)[0].errorCode;
				console.log(ec);
				if (ec === 'INVALID_SESSION_ID') {
					alert(`Error: ${response.responseText}`);
					needsession = true;
				}
				if (needsession) {
					getkey(me);
				}
			}
		},
	});
}

$(document).ready(() => {
	if (window.location.href === 'https://na8.salesforce.com/home/home.jsp' ||
		window.location.href === 'http://na8.salesforce.com/home/home.jsp' ||
		window.location.href === 'http://na8.salesforce.com/01ZC00000013c3z' ||
		window.location.href === 'https://na8.salesforce.com/01ZC00000013c3z') {
		console.log(GM_getValue('token'));
		watermark();
		ks();
	} else if ($('input[title="New Task"]').length === 1) {
		const e = $('input[title="New Task"]').eq(0);
		$('#topButtonRow').prepend(e.clone(true).addClass('btnImportant'));
	} else {
		const regex = /who_id/gm;
		const res = regex.test(window.location.href);
		if (res) go();
	}
});
