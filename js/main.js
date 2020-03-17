window.onerror = function (message, filename, lineno, colno, error) {
	if (error) {
		error.fileName = error.fileName || filename || null;
		error.lineNumber = error.lineNumber || lineno || null;
		error.columnNumber = error.columnNumber || colno || null;
	} else {
		error = {
			message: message,
			fileName: filename,
			lineNumber: lineno,
			columnNumber: colno
		};
	}
	console.error(
				'Uncatched Exception',
				'\n\n' +
				(error.toString()   ? 'Error:\t\t' + error.toString() : '') +
				(error.name         ? '\nName:\t\t' + error.name : '') +
				(error.message      ? '\nMessage:\t' + error.message : '') +
				(error.fileName     ? '\nFile:\t\t' + error.fileName : '') +
				(error.toSource     ? '\nSource:\t\t' + error.toSource() : '') +
				(error.lineNumber   ? '\nLine #:\t\t' + error.lineNumber : '') +
				(error.columnNumber ? '\nColumn #:\t' + error.columnNumber : '') +
				(error.stack        ? '\n\nStack:\n\n' + error.stack : ''));
};

var debounce = function (a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}};

var html_encode = function (string) {
	var entities = {
			'"': '&#34;', // quot
			'&': '&#38;', // amp
			'<': '&#60;', // lt
			'>': '&#62;', // gt
			'Œ': '&#338;', // OElig
			'œ': '&#339;', // oelig
			'Š': '&#352;', // Scaron
			'š': '&#353;', // scaron
			'Ÿ': '&#376;', // Yuml
			'ˆ': '&#710;', // circ
			'˜': '&#732;', // tilde
			'\u2002': '&#8194;', // ensp
			'\u2003': '&#8195;', // emsp
			'\u2009': '&#8201;', // thinsp
			'\u200C': '&#8204;', // zwnj
			'\u200D': '&#8205;', // zwj
			'\u200E': '&#8206;', // lrm
			'\u200F': '&#8207;', // rlm
			'–': '&#8211;', // ndash
			'—': '&#8212;', // mdash
			'‘': '&#8216;', // lsquo
			'’': '&#8217;', // rsquo
			'‚': '&#8218;', // sbquo
			'“': '&#8220;', // ldquo
			'”': '&#8221;', // rdquo
			'„': '&#8222;', // bdquo
			'†': '&#8224;', // dagger
			'‡': '&#8225;', // Dagger
			'‰': '&#8240;', // permil
			'‹': '&#8249;', // lsaquo
			'›': '&#8250;', // rsaquo
			'€': '&#8364;', // euro
			' ': '&nbsp;', // nbsp
			'\n': '<br>'
	};
	if (string === null || string === undefined) {
		return 'undefined';
	}
	if (!(string instanceof String)) {
		string = string.toString();
	}
	var output = '';
	for (var i = 0; i < string.length; ++i) {
		var c = string.charAt(i),
			entity = entities[c];
		if (c === ' ') {
			output += string.charAt(i - 1) === ' ' ? entity : c;
		} else if (entity) {
			output += entity;
		} else {
			output += c;
		}
	}
	return output;
};

var random_id = function (length, charset) {
	length = length || 6;
	charset = charset || '0123456789abcdef'
	var output = '';
	for (var i = 0; i < length; ++i) {
		output += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return output;
};

var open_dialog = function (settings) {
	var dialog_id = 'dialog-' + Date.now();
	var $dialog = $('<dialog id="' + dialog_id + '" class="dialog"></dialog>');
	if (settings.width) {
		$dialog.width(settings.width);
	}
	if (settings.height) {
		$dialog.height(settings.height);
	}
	if (settings.title) {
		var $dialog_title = $('<h3 class="dialog-title"></h3>').text(settings.title);
		$dialog.append($dialog_title);
	}
	if (settings.content) {
		var $dialog_content = $('<div class="dialog-content"></div>').append(settings.content);
		if (settings.height) {
			$dialog_content.css({ flex: 1 });
		}
		$dialog.append($dialog_content);
	}
	var $dialog_buttons = $('<div class="dialog-buttons"></div>');
	if (!settings.buttons) {
		var $button = $('<button class="button button-primary">Close</button>');
		$button.on('click', function () {
			$dialog[0].close();
			$dialog.remove();
		});
		$dialog_buttons.append($button);
		$dialog.append($dialog_buttons);
	} else if (settings.buttons.length > 0) {
		settings.buttons.forEach(function (button) {
			var $button = $('<button' + (button.id ? ' id="' + button.id + '"' : '') + ' class="' + (button.class || 'button') + '">' + button.label + '</button>');
			if (button.onclick) {
				$button.on('click', function (e) {
					button.onclick.call($dialog[0], e);
				});
			}
			$dialog_buttons.append($button);
		});
		$dialog.append($dialog_buttons);
	}
	$('body').append($dialog);
	var dialog = document.getElementById(dialog_id);
	if (window.dialogPolyfill) {
		dialogPolyfill.registerDialog(dialog);
	}
	dialog.addEventListener('close', function () {
		$dialog.remove();
	});
	dialog.showModal();
	return dialog;
};

var goto_page = function (page_id) {
	$('.page').hide();
	$('[data-page-id="' + page_id + '"]').show();
};

// example: 1d6 = dice(1, 6)
// example: 1rps = dice(1, ['rock', 'paper', 'scissors'])
var dice = function (num, values) {
	var result = [];
	for (var i = 0; i < num; ++i) {
		if (values instanceof Array) {
			result.push(values[Math.floor(Math.random() * values.length)]);
		} else {
			result.push(Math.floor(Math.random() * values) + 1);
		}
	}
	if (values instanceof Array) {
		if (result.length === 1) {
			result = result[0];
		}
	} else  {
		var sum = 0;
		result.forEach(function (value) {
			sum += value;
		});
		result = sum;
	}
	return result;
};

// example: dice_expression('3d6+2+45d2')
var dice_expression = function (expression) {
	var result = 'Evaluation Error';
	try {
		result = eval(expression.replace(/[0-9]+d[0-9]+/g, function (a) {
			var tokens = a.split('d'),
				q = parseInt(tokens[0], 10),
				f = parseInt(tokens[1], 10);
			return dice(q, f);
		}));
	} catch (e) {
		console.error(e);
	}
	return result;
};

var get_modifier = function (value) {
	return Math.floor((value - 10) / 2);
};

var get_modifier_string = function (value) {
	var modifier = get_modifier(value);
	return modifier >= 0 ? '+' + modifier.toString() : modifier.toString();
};

var render_monsters_list = function ($list_block, set) {
	if (!set) {
		return;
	}
	$list_block.empty();
	Object.keys(set).sort(function (a, b) {
		return set[a].name < set[b].name ? -1 : 1;
	}).forEach(function (monster_id) {
		var monster = set[monster_id];
		if (monster) {
			var cr = monster.challenge_rating;
			if (cr === 0.125) {
				cr = '1/8';
			} else if (cr === 0.25) {
				cr = '1/4';
			} else if (cr === 0.5) {
				cr = '1/2';
			}
			$list_block.append(
				'<li data-monster="' + monster_id + '">' +
					'<div class="font-big">' + monster.name + '</div>' +
					'<div class="font-small font-gray font-italic">CR ' + cr + (monster.type ? ', ' + monster.type : '') + '</div>' +
				'</li>');
		}
	});
};

var filter_monsters_list = function ($monsters_list, filter, pattern) {
	$monsters_list.find('li').each(function () {
		var $li = $(this);
		if (pattern === '') {
			$li.show();
		} else {
			var monster_id = $li.data('monster'),
				monster = CAMPAIGN.characters[monster_id] || DND5_MONSTERS[monster_id];
			if (!monster) {
				$li.hide();
			} else {
				var f1 = monster.name && monster.name.toLowerCase().indexOf(pattern) !== -1,
					f2 = monster.name_it && monster.name_it.toLowerCase().indexOf(pattern) !== -1,
					f3 = monster.type && monster.type.toLowerCase() === pattern,
					f4 = monster.challenge_rating && monster.challenge_rating === parseFloat(pattern),
					f5 = monster.environment && monster.environment.toString().toLowerCase().indexOf(pattern) !== -1;
				if (f1 || f2 || f3 || f4 || f5) {
					$li.show();
				} else {
					$li.hide();
				}
			}
		}
	});
};

var render_monster_preview = function ($preview, monster_id, monster_object) {
	if (!window.DND5_MONSTERS) {
		return;
	}
	var monster;
	if (monster_id) {
		monster = CAMPAIGN.characters[monster_id];
	} else if (monster_object) {
		monster = monster_object;
	}
	if (monster && $preview) {
		$preview.empty();
		if (monster_id) {
			$preview.append(
				'<div class="flex-row">' +
					'<button data-action="edit-monster" data-monster="' + monster.id + '" class="button">Edit</button>' +
				'</div>');
		}
		$preview.append(
			'<h2 class="h2 h2-dnd">' + html_encode(monster.name || '-') + '</h2>' +
			'<p class="p font-italic">' + html_encode(monster.size || '-') + ' ' + html_encode(monster.type || '-') + ', ' + html_encode(monster.alignment || '-') + '</p>' +
			'<hr class="hr hr-dnd">');
		var cr = monster.challenge_rating;
		if (cr === 0.125) {
			cr = '1/8';
		} else if (cr === 0.25) {
			cr = '1/4';
		} else if (cr === 0.5) {
			cr = '1/2';
		}
		if (monster.source && monster.source.indexOf('SRD') === -1) {
			$preview.append(
				'<ul style="list-style: none outside none">' +
					'<li><span class="font-bold">Challenge</span> ' + html_encode(cr || '-') + '</li>' +
				'</ul>' +
				'<p class="p">Not in SRD, data not available.</p>');
		} else {
			$preview.append(
				'<ul style="list-style: none outside none">' +
					'<li><span class="font-bold">Armor Class</span> ' + html_encode(monster.armor_class || '-') + '</li>' +
					'<li><span class="font-bold">Hit Points</span> ' + html_encode(monster.hit_points || '-') + '</li>' +
					'<li><span class="font-bold">Speed</span> ' + html_encode(monster.speed || '-') + '</li>' +
				'</ul>' +
				'<hr class="hr hr-dnd">' +
				'<table>' +
					'<thead>' +
						'<tr>' +
							'<th class="align-center" style="width: 3rem">STR</th>' +
							'<th class="align-center" style="width: 3rem">DEX</th>' +
							'<th class="align-center" style="width: 3rem">CON</th>' +
							'<th class="align-center" style="width: 3rem">INT</th>' +
							'<th class="align-center" style="width: 3rem">WIS</th>' +
							'<th class="align-center" style="width: 3rem">CHA</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<td class="align-center">' + (monster.strength ? monster.strength + '<br>(' + get_modifier_string(monster.strength) + ')' : '-') + '</td>' +
							'<td class="align-center">' + (monster.dexterity ? monster.dexterity + '<br>(' + get_modifier_string(monster.dexterity) + ')' : '-') + '</td>' +
							'<td class="align-center">' + (monster.constitution ? monster.constitution + '<br>(' + get_modifier_string(monster.constitution) + ')' : '-') + '</td>' +
							'<td class="align-center">' + (monster.intelligence ? monster.intelligence + '<br>(' + get_modifier_string(monster.intelligence) + ')' : '-') + '</td>' +
							'<td class="align-center">' + (monster.wisdom ? monster.wisdom + '<br>(' + get_modifier_string(monster.wisdom) + ')' : '-') + '</td>' +
							'<td class="align-center">' + (monster.charisma ? monster.charisma + '<br>(' + get_modifier_string(monster.charisma) + ')' : '-') + '</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
				'<hr class="hr hr-dnd">' +
				'<ul style="list-style: none outside none">' +
					'<li><span class="font-bold">Damage Resistances</span> ' + html_encode(monster.damage_resistances || '-') + '</li>' +
					'<li><span class="font-bold">Damage Immunities</span> ' + html_encode(monster.damage_immunities || '-') + '</li>' +
					'<li><span class="font-bold">Condition Immunities</span> ' + html_encode(monster.condition_immunities || '-') + '</li>' +
					'<li><span class="font-bold">Senses</span> ' + html_encode(monster.senses || '-') + '</li>' +
					'<li><span class="font-bold">Languages</span> ' + html_encode(monster.languages || '-') + '</li>' +
					'<li><span class="font-bold">Challenge</span> ' + html_encode(cr || '-') + '</li>' +
				'</ul>' +
				'<hr class="hr hr-dnd">');
			if (monster.special_abilities) {
				monster.special_abilities.forEach(function (item) {
					$preview.append('<p class="p"><span class="font-bold font-italic">' + html_encode(item.name) + '.</span> ' + html_encode(item.desc) + '</p>');
				});
			}
			if (monster.actions) {
				$preview.append('<h3 class="h3 h3-dnd">Actions</h3>');
				monster.actions.forEach(function (item) {
					$preview.append('<p class="p"><span class="font-bold font-italic">' + html_encode(item.name) + '.</span> ' + html_encode(item.desc) + '</p>');
				});
			}
			if (monster.legendary_actions) {
				$preview.append('<h3 class="h3 h3-dnd">Legendary Actions</h3>');
				monster.legendary_actions.forEach(function (item) {
					$preview.append('<p class="p"><span class="font-bold font-italic">' + html_encode(item.name) + '.</span> ' + html_encode(item.desc) + '</p>');
				});
			}
		}
		if (monster.desc) {
			$preview.append(
				'<h3 class="h3 h3-dnd">Description</h3>' +
				'<p class="p">' + html_encode(monster.desc) + '</p>');
		}
		if (monster.environment && monster.environment.length > 0) {
			$preview.append('<p class="p"><span class="font-bold">Environment:</span> ' + monster.environment.join(', ') + '</p>');
		}
		if (monster.source) {
			$preview.append('<p class="p"><span class="font-bold">Source:</span> ' + monster.source.join(', ') + '</p>');
		}
	}
};

var select_monster_dialog = function (callback) {
	var $content = $(
		'<div class="flex-column" style="height: 100%">' +
			'<div class="flex-row">' +
				'<input id="select-monster-search" type="search" placeholder="Search" class="input" style="flex: 1">' +
			'</div>' +
			'<div class="flex-1" style="overflow: auto">' +
				'<ol id="select-monster-list" class="list list-hover"></ol>' +
			'</div>' +
		'</div>');
	var $select_monster_search = $content.find('#select-monster-search');
	$select_monster_search.on('input', function () {
		var pattern = $(this).val().toLowerCase();
		filter_monsters_list($content.find('#select-monster-list'), null, pattern);
	});
	var $select_monster_list = $content.find('#select-monster-list').empty();
	render_monsters_list($select_monster_list, DND5_MONSTERS);
	$select_monster_list.on('click', 'li', function () {
		var monster_id = $(this).data('monster'),
			monster = CAMPAIGN.characters[monster_id] || DND5_MONSTERS[monster_id];
		dialog.close();
		callback(monster);
	});
	var dialog = open_dialog({
		title: 'Select Monster',
		height: Math.round(window.innerHeight * 0.75),
		content: $content,
		buttons: [
			{
				label: 'Cancel',
				onclick: function () {
					this.close();
				}
			}
		]
	});
};

var edit_monster_dialog = function (monster) {
	if (!monster) {
		select_monster_dialog(function (selected_monster) {
			edit_monster_dialog(selected_monster);
		});
		return;
	}
	var action = CAMPAIGN.characters[monster.id] ? 'edit' : 'add';
	var $content = $(
		'<div class="form">' +
			'<div class="form-field">' +
				'<label for="monster-name">Name</label>' +
				'<input id="monster-name" type="text" class="input">' +
			'</div>' +
			'<div class="form-field">' +
				'<label for="monster-desc">Description</label>' +
				'<textarea id="monster-desc" rows="10" class="input"></textarea>' +
			'</div>' +
		'</div>');
	if (action === 'edit') {
		$content.find('#monster-name').val(monster.name);
		$content.find('#monster-desc').val(monster.desc);
	}
	var buttons = [];
	buttons.push({
		label: 'Cancel',
		onclick: function () {
			this.close();
		}
	});
	if (action === 'edit') {
		buttons.push({
			label: 'Delete',
			class: 'button button-danger',
			onclick: function () {
				delete CAMPAIGN.characters[monster.id];
				render_monsters_list($('#campaign-monsters-list'), CAMPAIGN.characters);
				$('#campaign-monsters-preview').empty();
				this.close();
			}
		});
	}
	buttons.push({
		label: action === 'edit' ? 'Edit' : 'Add',
		class: 'button button-primary',
		onclick: function () {
			var name = $content.find('#monster-name').val().trim();
			if (!name || name === '') {
				open_dialog({ title: 'Warning', content: 'Invalid name.' });
				return;
			}
			var desc = $content.find('#monster-desc').val().trim();
			if (!desc || desc === '') {
				open_dialog({ title: 'Warning', content: 'Invalid description.' });
				return;
			}
			var new_monster = $.extend(true, {}, monster);
			if (action === 'add') {
				new_monster.id = random_id();
			}
			new_monster.name = name;
			new_monster.desc = desc;
			CAMPAIGN.characters[new_monster.id] = new_monster;
			render_monsters_list($('#campaign-monsters-list'), CAMPAIGN.characters);
			$('#campaign-monsters-preview').empty();
			this.close();
		}
	});
	open_dialog({
		title: action === 'edit' ? 'Edit Character' : 'Add Character',
		content: $content,
		buttons: buttons
	});
};

var render_spells_list = function ($list_block) {
	if (!window.DND5_SPELLS) {
		return;
	}
	$list_block.empty();
	Object.keys(DND5_SPELLS).sort(function (a, b) {
		return DND5_SPELLS[a].name < DND5_SPELLS[b].name ? -1 : 1;
	}).forEach(function (spell_id) {
		var spell = DND5_SPELLS[spell_id];
		$list_block.append(
			'<li data-spell="' + spell_id + '">' +
				'<div class="font-big">' + html_encode(spell.name) + '</div>' +
				'<div class="font-small font-gray font-italic">Level ' + html_encode(spell.level) + ' - ' + spell.class.join(', ') + '</div>' +
			'</li>');
	});
};

var filter_spells_list = function ($spells_list, filter, pattern) {
	$spells_list.find('li').each(function () {
		var $li = $(this);
		if (pattern === '') {
			$li.show();
		} else {
			var spell_id = $li.data('spell'),
				spell = DND5_SPELLS[spell_id];
			if (!spell) {
				$li.hide();
			} else {
				var f1 = spell.name && spell.name.toLowerCase().indexOf(pattern) !== -1,
					f2 = spell.name_it && spell.name_it.toLowerCase().indexOf(pattern) !== -1,
					f3 = spell.class && spell.class.toString().toLowerCase().indexOf(pattern) !== -1,
					f4 = spell.level && spell.level === parseFloat(pattern),
					f5 = spell.school && spell.school === parseFloat(pattern);
				if (f1 || f2 || f3 || f4 || f5) {
					$li.show();
				} else {
					$li.hide();
				}
			}
		}
	});
};

var render_spell_preview = function ($preview, spell_id, spell_object) {
	if (!window.DND5_SPELLS) {
		return;
	}
	var spell;
	if (spell_id) {
		spell = DND5_SPELLS[spell_id];
	} else if (spell_object) {
		spell = spell_object;
	}
	if (spell && $preview) {
		$preview.empty();
		var level = spell.level;
		if (level === 1) {
			level += 'st';
		} else if (level === 1) {
			level += 'nd';
		} else if (level === 1) {
			level += 'rd';
		} else {
			level += 'th';
		}
		$preview.append(
			'<h2 class="h2 h2-dnd">' + html_encode(spell.name || '-') + '</h2>' +
			'<p class="p font-italic">' + html_encode(level) + '-level ' + html_encode(spell.school) + html_encode(spell.ritual ? ' (ritual)' : '') + '</p>' +
			'<ul style="list-style: none outside none">' +
				'<li><span class="font-bold">Casting Time:</span> ' + html_encode(spell.casting_time || '-') + '</li>' +
				'<li><span class="font-bold">Range/Area:</span> ' + html_encode(spell.range || '-') + '</li>' +
				'<li><span class="font-bold">Components:</span> ' + html_encode(spell.components || '-') + html_encode(spell.material ? ' (' + spell.material + ')' : '') + '</li>' +
				'<li><span class="font-bold">Duration:</span> ' + html_encode(spell.concentration ? 'Concentration, ' : '') + html_encode(spell.duration || '-') + '</li>' +
				(spell.class && spell.class.length > 0 ? '<li><span class="font-bold">Class:</span> ' + spell.class.join(', ') + '</li>' : '') +
				(spell.subclass && spell.subclass.length > 0 ? '<li><span class="font-bold">Subclass:</span> ' + spell.subclass.join(', ') + '</li>' : '') +
				(spell.source ? '<li><span class="font-bold">Source:</span> ' + spell.source.join(', ') + '</li>' : '') +
			'</ul>');
		if (spell.source.indexOf('SRD') === -1) {
			$preview.append('<p class="p">Not in SRD, data not available.</p>');
		} else {
			if (spell.desc) {
				spell.desc.forEach(function (paragraph) {
					$preview.append('<p class="p">' + html_encode(paragraph) + '</p>');
				});
			}
			if (spell.higher_level) {
				$preview.append('<p class="p">' + html_encode(spell.higher_level) + '</p>');
			}
		}
	}
};

var render_items_list = function ($list_block, set) {
	$list_block.empty();
	if (!set) {
		set = CAMPAIGN.items;
	}
	Object.keys(set).sort(function (a, b) {
		return set[a].name < set[b].name ? -1 : 1;
	}).forEach(function (item_id) {
		var item = set[item_id];
		if (item) {
			$list_block.append(
				'<li data-item="' + item_id + '">' +
					'<div class="font-big">' + html_encode(item.name || '-') + '</div>' +
					'<div class="font-small font-gray font-italic">' + html_encode(item.type || '-') + ', ' + html_encode(item.rarity || '-') + html_encode(item.attunement ? ' (requires attunement)' : '') + '</div>' +
				'</li>');
		}
	});
};

var filter_items_list = function ($items_list, filter, pattern) {
	$items_list.find('li').each(function () {
		var $li = $(this);
		if (pattern === '') {
			$li.show();
		} else {
			var item_id = $li.data('item'),
				item = DND5_ITEMS[item_id];
			if (!item) {
				$li.hide();
			} else {
				var f1 = item.name && item.name.toLowerCase().indexOf(pattern) !== -1,
					f2 = item.name_it && item.name_it.toLowerCase().indexOf(pattern) !== -1,
					f3 = item.type && item.type.toLowerCase() === pattern,
					f4 = item.rarity && item.rarity.toLowerCase() === pattern;
				if (f1 || f2 || f3 || f4) {
					$li.show();
				} else {
					$li.hide();
				}
			}
		}
	});
};

var render_item_preview = function ($preview, item_id, item_object) {
	var item;
	if (item_id) {
		item = CAMPAIGN.items[item_id];
	} else if (item_object) {
		item = item_object;
	}
	if (item && $preview) {
		$preview.empty();
		if (item_id) {
			$preview.append(
				'<div class="flex-row">' +
					'<button data-action="edit-item" data-item="' + item.id + '" class="button">Edit</button>' +
				'</div>');
		}
		$preview.append(
			'<h2 class="h2 h2-dnd">' + html_encode(item.name || '-') + '</h2>' +
			'<p class="p font-italic">' + html_encode(item.type || '-') + (item.limits ? ' (' + html_encode(item.limits) + ')' : '') + ', ' + html_encode(item.rarity || '-') + html_encode(item.attunement ? ' (requires attunement)' : '') + '</p>' +
			'<p class="p">' + html_encode(item.desc ? item.desc.replace(/\r\n/g, '<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>') : '-') + '</p>');
		if (spell.source) {
			$preview.append('<p class="p"><span class="font-bold">Source:</span> ' + spell.source.join(', ') + '</p>');
		}
	}
};

var edit_item_dialog = function (item) {
	var $content = $(
		'<div class="form">' +
			'<div class="form-field">' +
				'<label for="item-name">Name</label>' +
				'<input id="item-name" type="text" class="input">' +
			'</div>' +
			'<div class="form-field">' +
				'<label for="item-type">Type</label>' +
				'<select id="item-type" class="select">' +
					'<option>Armor</option>' +
					'<option>Potion</option>' +
					'<option>Rod</option>' +
					'<option>Scroll</option>' +
					'<option>Staff</option>' +
					'<option>Wand</option>' +
					'<option>Weapon</option>' +
					'<option>Wondrous Item</option>' +
				'</select>' +
			'</div>' +
			'<div class="form-field">' +
				'<label for="item-rarity">Rarity</label>' +
				'<select id="item-rarity" class="select">' +
					'<option>Common</option>' +
					'<option>Uncommon</option>' +
					'<option>Rare</option>' +
					'<option>Very rare</option>' +
					'<option>Legendary</option>' +
				'</select>' +
			'</div>' +
			'<div class="form-field">' +
				'<label for="item-attunement">Requires Attunement</label>' +
				'<select id="item-attunement" class="select">' +
					'<option value="no">No</option>' +
					'<option value="yes">Yes</option>' +
				'</select>' +
			'</div>' +
			'<div class="form-field">' +
				'<label for="item-desc">Description</label>' +
				'<textarea id="item-desc" rows="10" class="input"></textarea>' +
			'</div>' +
		'</div>');
	if (item) {
		$content.find('#item-name').val(item.name);
		$content.find('#item-type').val(item.type);
		$content.find('#item-rarity').val(item.rarity);
		$content.find('#item-attunement').val(item.attunement ? 'yes' : 'no');
		$content.find('#item-desc').val(item.desc);
	}
	var buttons = [];
	buttons.push({
		label: 'Cancel',
		onclick: function () {
			this.close();
		}
	});
	if (item) {
		buttons.push({
			label: 'Delete',
			class: 'button button-danger',
			onclick: function () {
				delete CAMPAIGN.items[item.id];
				render_items_list($('#campaign-items-list'), CAMPAIGN.items);
				$('#campaign-items-preview').empty();
				this.close();
			}
		});
	}
	buttons.push({
		label: item ? 'Edit' : 'Add',
		class: 'button button-primary',
		onclick: function () {
			var name = $content.find('#item-name').val().trim();
			if (!name || name === '') {
				open_dialog({ title: 'Warning', content: 'Invalid name.' });
				return;
			}
			var desc = $content.find('#item-desc').val().trim();
			if (!desc || desc === '') {
				open_dialog({ title: 'Warning', content: 'Invalid description.' });
				return;
			}
			var new_item = {
				id: item ? item.id : random_id(),
				name: name,
				type: $content.find('#item-type').val(),
				rarity: $content.find('#item-rarity').val(),
				attunement: $content.find('#item-attunement').val() === 'yes',
				desc: desc
			}
			CAMPAIGN.items[new_item.id] = new_item;
			render_items_list($('#campaign-items-list'), CAMPAIGN.items);
			$('#campaign-items-preview').empty();
			this.close();
		}
	});
	open_dialog({
		title: item ? 'Edit Item' : 'Add Item',
		content: $content,
		buttons: buttons
	});
};

var render_characters_list = function ($list_block, set) {
	$list_block.empty();
	if (!set) {
		set = CAMPAIGN.characters;
	}
	Object.keys(set).sort(function (a, b) {
		return set[a].name < set[b].name ? -1 : 1;
	}).forEach(function (pc_id) {
		var pc = set[pc_id];
		if (pc) {
			$list_block.append(
				'<li data-pc="' + pc_id + '">' +
					'<div class="font-big">' + html_encode(pc.name) + '</div>' +
					'<div class="font-small font-gray font-italic">' + html_encode(pc.desc || '-') + '</div>' +
				'</li>');
		}
	});
};

var render_documents_list = function ($list_block, set) {
	$list_block.empty();
	if (!set) {
		set = CAMPAIGN.documents;
	}
	Object.keys(set).sort(function (a, b) {
		return set[a].name < set[b].name ? -1 : 1;
	}).forEach(function (doc_id) {
		var doc = set[doc_id];
		if (doc) {
			$list_block.append(
				'<li data-document="' + doc_id + '">' +
					'<div class="font-big">' + html_encode(doc.name || '-') + '</div>' +
					'<div class="font-small font-gray font-italic">' + html_encode(doc.type || '-') + '</div>' +
				'</li>');
		}
	});
};

var render_document_preview = function ($preview, document_id, document_object) {
	var doc;
	if (document_id) {
		doc = CAMPAIGN.documents[document_id];
	} else if (document_object) {
		doc = document_object;
	}
	if (doc && $preview) {
		$preview.empty();
		$preview.append(
			'<div class="flex-row">' +
				'<button data-action="delete-document" data-document="' + doc.id + '" class="button button-danger">Delete</button>' +
			'</div>' +
			'<h2 class="h2 h2-dnd">' + html_encode(doc.name || '-') + '</h2>');
		if (doc.type.indexOf('image/') !== -1) {
			$preview.append('<img src="' + doc.data + '">');
		} else {
			$preview.append('<a href="' + doc.data + '" download="' + html_encode(doc.name || '-') + '" class="a">DOWNLOAD</a>');
		}
	}
};

var render_notes_list = function ($list_block, set) {
	$list_block.empty();
	if (!set) {
		set = CAMPAIGN.notes;
	}
	Object.keys(set).sort(function (a, b) {
		return set[a].name < set[b].name ? -1 : 1;
	}).forEach(function (note_id) {
		var note = set[note_id];
		if (note) {
			$list_block.append(
				'<li data-note="' + note_id + '">' +
					'<div class="font-big">' + html_encode(note.name || '-') + '</div>' +
				'</li>');
		}
	});
};

var render_note_preview = function ($preview, note_id, note_object) {
	var note;
	if (note_id) {
		note = CAMPAIGN.notes[note_id];
	} else if (note_object) {
		note = note_object;
	}
	if (note && $preview) {
		$preview.empty();
		$preview.append(
			'<div class="flex-row">' +
				'<button data-action="edit-note" data-note="' + note.id + '" class="button">Edit</button>' +
			'</div>' +
			'<h2 class="h2 h2-dnd">' + html_encode(note.name || '-') + '</h2>' +
			'<p class="p">' + html_encode(note.desc ? note.desc.replace(/\r\n/g, '<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>') : '-') + '</p>');
	}
};

var edit_note_dialog = function (note) {
	var $content = $(
		'<div class="form">' +
			'<div class="form-field">' +
				'<label for="note-name">Name</label>' +
				'<input id="note-name" type="text" class="input">' +
			'</div>' +
			'<div class="form-field">' +
				'<label for="note-desc">Description</label>' +
				'<textarea id="note-desc" rows="10" class="input"></textarea>' +
			'</div>' +
		'</div>');
	if (note) {
		$content.find('#note-name').val(note.name);
		$content.find('#note-desc').val(note.desc);
	}
	var buttons = [];
	buttons.push({
		label: 'Cancel',
		onclick: function () {
			this.close();
		}
	});
	if (note) {
		buttons.push({
			label: 'Delete',
			class: 'button button-danger',
			onclick: function () {
				delete CAMPAIGN.notes[note.id];
				render_notes_list($('#campaign-notes-list'), CAMPAIGN.notes);
				$('#campaign-notes-preview').empty();
				this.close();
			}
		});
	}
	buttons.push({
		label: note ? 'Edit' : 'Add',
		class: 'button button-primary',
		onclick: function () {
			var name = $content.find('#note-name').val().trim();
			if (!name || name === '') {
				open_dialog({ title: 'Warning', content: 'Invalid name.' });
				return;
			}
			var desc = $content.find('#note-desc').val().trim();
			if (!desc || desc === '') {
				open_dialog({ title: 'Warning', content: 'Invalid description.' });
				return;
			}
			var new_note = {
				id: note ? note.id : random_id(),
				name: name,
				desc: desc
			}
			CAMPAIGN.notes[new_note.id] = new_note;
			render_notes_list($('#campaign-notes-list'), CAMPAIGN.notes);
			$('#campaign-notes-preview').empty();
			this.close();
		}
	});
	open_dialog({
		title: note ? 'Edit Note' : 'Add Note',
		content: $content,
		buttons: buttons
	});
};

window.CAMPAIGN = {
	characters: {},
	items: {},
	documents: {},
	notes: {}
};

$('body').on('click', '[data-page]', function () {
	goto_page($(this).data('page'));
}).on('click', '[data-action]', function () {
	var action = $(this).data('action');
	if (action === 'import') {

		$('#campaign-import-input').click();

	} else if (action === 'export') {

		var blob = new Blob([JSON.stringify(window.CAMPAIGN)], { type: 'application/json;charset=UTF-8', encoding: 'UTF-8' });
		saveAs(blob, 'campaign.json');

	} else if (action === 'add-monster') {

		edit_monster_dialog();

	} else if (action === 'edit-monster') {

		var monster_id = $(this).data('monster').toString(),
			monster = CAMPAIGN.characters[monster_id];
		if (monster) {
			edit_monster_dialog(monster);
		}

	} else if (action === 'add-item') {

		edit_item_dialog();

	} else if (action === 'edit-item') {

		var item_id = $(this).data('item').toString(),
			item = CAMPAIGN.items[item_id];
		if (item) {
			edit_item_dialog(item);
		}

	} else if (action === 'add-document') {

		$('#campaign-document-input').click();

	} else if (action === 'delete-document') {

		var document_id = $(this).data('document').toString(),
			doc = CAMPAIGN.documents[document_id];
		if (doc) {
			delete CAMPAIGN.documents[document_id];
			render_documents_list($('#campaign-documents-list'), CAMPAIGN.documents);
			$('#campaign-documents-preview').empty();
		}

	} else if (action === 'add-note') {

		edit_note_dialog();

	} else if (action === 'edit-note') {

		var note_id = $(this).data('note').toString(),
			note = CAMPAIGN.notes[note_id];
		if (note) {
			edit_note_dialog(note);
		}

	}
});

$('#campaign-import-input').on('change', function () {
	var file = this.files[0];
	this.value = null;
	var reader = new FileReader();
	reader.onabort = function () {
		open_dialog({
			title: 'Aborted',
			content: 'The import has been aborted.'
		});
	};
	reader.onerror = function () {
		reader.abort();
	};
	reader.onload = function (event) {
		window.CAMPAIGN = JSON.parse(event.target.result);
		render_campaign();
	};
	reader.readAsText(file);
});

$('#campaign-document-input').on('change', function () {
	var file = this.files[0];
	this.value = null;
	var reader = new FileReader();
	reader.onabort = function () {
		open_dialog({
			title: 'Aborted',
			content: 'The import has been aborted.'
		});
	};
	reader.onerror = function () {
		reader.abort();
	};
	reader.onload = function (event) {
		var new_document = {
			id: random_id(),
			name: file.name,
			type: file.type,
			data: event.target.result
		};
		CAMPAIGN.documents[new_document.id] = new_document;
		render_documents_list($('#campaign-documents-list'), CAMPAIGN.documents);
		$('#campaign-documents-preview').empty();
	};
	reader.readAsDataURL(file);
});

var render_campaign = function () {
	render_monsters_list($('#campaign-monsters-list'), CAMPAIGN.characters);
	render_items_list($('#campaign-items-list'), CAMPAIGN.items);
	render_documents_list($('#campaign-documents-list'), CAMPAIGN.documents);
	render_notes_list($('#campaign-notes-list'), CAMPAIGN.notes);
};

var $compendium_monsters_search = $('#compendium-monsters-search');
$compendium_monsters_search.on('input', function () {
	var pattern = $(this).val().toLowerCase();
	filter_monsters_list($('#compendium-monsters-list'), null, pattern);
});
var $compendium_monsters_list = $('#compendium-monsters-list').empty();
render_monsters_list($compendium_monsters_list, DND5_MONSTERS);
$compendium_monsters_list.on('click', 'li', function () {
	var monster_id = $(this).data('monster'),
		monster = DND5_MONSTERS[monster_id];
	render_monster_preview($('#compendium-monsters-preview'), null, monster);
});

var $compendium_spells_search = $('#compendium-spells-search');
$compendium_spells_search.on('input', function () {
	var pattern = $(this).val().toLowerCase();
	filter_spells_list($('#compendium-spells-list'), null, pattern);
});
var $compendium_spells_list = $('#compendium-spells-list').empty();
render_spells_list($compendium_spells_list, DND5_SPELLS);
$compendium_spells_list.on('click', 'li', function () {
	var spell_id = $(this).data('spell'),
		spell = DND5_SPELLS[spell_id];
	render_spell_preview($('#compendium-spells-preview'), null, spell);
});

var $compendium_items_search = $('#compendium-items-search');
$compendium_items_search.on('input', function () {
	var pattern = $(this).val().toLowerCase();
	filter_items_list($('#compendium-items-list'), null, pattern);
});
var $compendium_items_list = $('#compendium-items-list').empty();
render_items_list($compendium_items_list, DND5_ITEMS);
$compendium_items_list.on('click', 'li', function () {
	var item_id = $(this).data('item'),
		item = DND5_ITEMS[item_id];
	render_item_preview($('#compendium-items-preview'), null, item);
});

$('#campaign-monsters-list').on('click', 'li', function () {
	var monster_id = $(this).data('monster').toString();
	render_monster_preview($('#campaign-monsters-preview'), monster_id);
});

$('#campaign-items-list').on('click', 'li', function () {
	var item_id = $(this).data('item').toString();
	render_item_preview($('#campaign-items-preview'), item_id);
});

$('#campaign-documents-list').on('click', 'li', function () {
	var document_id = $(this).data('document').toString();
	render_document_preview($('#campaign-documents-preview'), document_id);
});

$('#campaign-notes-list').on('click', 'li', function () {
	var note_id = $(this).data('note').toString();
	render_note_preview($('#campaign-notes-preview'), note_id);
});

render_campaign();
