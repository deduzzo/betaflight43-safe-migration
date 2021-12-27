<script>
	import {Snackbar, MaterialApp, Button, Chip, Card, CardActions, CardText, TextField} from 'svelte-materialify';
	import 'codemirror/mode/python/python'
	import CodeMirror from "./index"
	let editor;
	let backup = "# -- paste results of 'diff all' here --"
	let safeCommands= ['feature', 'beacon', 'map', 'serial', 'sbus', 'aux', 'min_check', 'max_check', 'blackbox', 'vtx',
						'dshot','beeper','yaw_motors_reversed','small_angle','osd','debug_mode', 'name', 'idle_min_rpm',
						'batch','led', 'resource', 'board', 'manufacturer' ]
	let safeSections= ['rateprofile'];
	let otherSections = ['profile']
	let unsafeCommands= ['gyro_', 'acc_', 'dterm_', 'dyn_', 'rc_']
	let newSafeCommand, newUnsafeCommand;
	let snackbar = false;
	let snackTest = ""
	const addRemoveInArray = (from, thing, operation) =>
	{
		if (thing !== "")
			switch (from) {
				case 'unsafe':
					if (operation === "remove")
						unsafeCommands = [...unsafeCommands.filter(item => item !== thing)];
					else if (operation === "add")
						if (!unsafeCommands.includes(thing))
							unsafeCommands = [...unsafeCommands,thing];
					break;
				case 'safe':
					if (operation === "remove")
						safeCommands = [...safeCommands.filter(item => item !== thing)];
					else if (operation === "add")
						if (!safeCommands.includes(thing))
							safeCommands = [...safeCommands,thing];
					break;
				case 'safeSection':
					if (operation === "remove")
						safeSections = [...safeSections.filter(item => item !== thing)];
					else if (operation === "add")
						if (!safeSections.includes(thing))
							safeSections = [...safeSections,thing];
					break;
			}
		newUnsafeCommand = ""
		newSafeCommand = ""
	}

	const filterBackup = () => {
		let out = "# STARTING PROCESS ";
		backup = editor.getValue();
		if (backup.length === 0)
			snackTest = "Nothing to analyze"
		else {
			let backupRows = backup.split('\n')
			let weAreInSafeSection = false;
			for (let row of backupRows)
			{
				row = row.toLowerCase().trim().replace("set ","");
				if (!weAreInSafeSection)
				{
					if (safeSections.some(command => row.startsWith(command)))
						weAreInSafeSection = true;
				}
				else {
					if (otherSections.some(command => row.startsWith(command)))
						if (!safeSections.some(command => row.startsWith(command)))
							weAreInSafeSection = false;
				}
				if (row.length) {
					let safe = null;
					if (row.startsWith('#')) // safe
						safe = true;
					else {
						let findForSafeCommands = safeCommands.some(command => row.startsWith(command))
						let findForUnSafeCommands = unsafeCommands.some(command => row.startsWith(command))
						if (findForUnSafeCommands)
							safe = false;
						else if (findForSafeCommands)
							safe = true;
					}

					if (safe !== false && weAreInSafeSection)
						safe = true;
					if (safe || safe === null)
						out = out + "\n" + row + (safe ? (!row.startsWith('#') ?" #SAFE" + (weAreInSafeSection ? "_SECTION":"" ) :"") : " #TO_CHECK")
					else if (!safe)
						out = out + "\n# " + row + " #UNSAFE!!"
				}
				else out += "\n"
			}
			editor.setValue(out)
			snackTest = "Completed!"
		}
		snackbar = true;
	}
	const options = {
		mode: "python",
		lineNumbers: true,
		value: backup,
	}


</script>

<MaterialApp>
	<Snackbar class="flex-column" bind:active={snackbar} bottom center timeout={2000}>
		{snackTest}
	</Snackbar>
	<div class="pa-4">
		<div class="d-flex justify-center ma-5"><h2>Betaflight 4.3 CLI Migrator v.0.1</h2></div>
		<div class="d-flex justify-center ma-5">
			<CodeMirror bind:editor {options} class="editor" />
		</div>
		<div class="d-flex justify-center ma-5">
			<Button class="d-flex flex-row" on:click={filterBackup}>Get BetaFlight 4.3 safe diff</Button>
		</div>
		<Card class="d-flex justify-center ma-5 pa-6" >
			<div class="pl-4 pr-4 pt-3">
				<span class="text-overline">Options</span>
			</div>
			<CardText>
				<Card class="d-flex ma-5" outlined>
					<div class="pl-4 pr-4 pt-3">
						<span class="text-overline red">UNSAFE COMMANDS</span>
					</div>
					<CardText>
						{#each unsafeCommands as unsafeCommand}
							<Chip on:close={() => addRemoveInArray('unsafe', unsafeCommand,'remove') } close size="small" class="ma-2 red-text" >{unsafeCommand}</Chip>
						{/each}
					</CardText>
					<CardActions>
						<TextField bind:value={newUnsafeCommand} on:keypress={(ev) => {if (ev.code === 'Enter') addRemoveInArray('unsafe', newUnsafeCommand,'add'); } } placeholder="Add Unsafe command" />
						<Button on:click={() => addRemoveInArray('unsafe', newUnsafeCommand,'add') } rounded outlined>Add</Button>
					</CardActions>
				</Card>
				<Card class="d-flex ma-5" outlined>
					<div class="pl-4 pr-4 pt-3">
						<span class="text-overline">SAFE COMMANDS</span>
					</div>
					<CardText>
						{#each safeCommands as safeCommand}
							<Chip on:close={() => addRemoveInArray('safe', safeCommand,'remove') } close size="small" class="ma-2 green-text">{safeCommand}</Chip>
						{/each}
					</CardText>
					<CardActions>
						<TextField bind:value={newSafeCommand} on:keypress={(ev) => {if (ev.code === 'Enter') addRemoveInArray('safe', newSafeCommand,'add'); } } placeholder="Add Safe command" />
						<Button on:click={() => addRemoveInArray('safe', newSafeCommand,'add') } rounded outlined>Add</Button>
					</CardActions>
				</Card>
			</CardText>
		</Card>
	</div>
</MaterialApp>

<style>
	:global(.editor) {
		font-size: 0.8rem;
		width: 800px;
	}
</style>
