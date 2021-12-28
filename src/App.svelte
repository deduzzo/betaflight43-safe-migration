<script>
	import {Snackbar, MaterialApp, Button, Chip, Card, CardActions, CardText, TextField} from 'svelte-materialify';
	import 'codemirror/mode/python/python'
	import CodeMirror from "./index"
	let editor;
	let backup = "# -- paste results of 'diff all' here --"
	let safeCommands = ['aux','beacon', 'blackbox','batch','board','debug_mode', 'dshot', 'beeper','feature' ,'led', 'map', 'max_check','min_check','osd','sbus'
						,'serial', 'idle_min_rpm', 'manufacturer' ,'name','resource', 'small_angle','vtx','vtxtable','yaw_motors_reversed']
	let unsafeSections= ['rateprofile'];
	let otherSectionsAndSectionsEnder = ['profile', 'batch']
	let unsafeCommands= ['acc', 'dterm', 'dyn', 'ff', 'gyro',  'rc']
	let newSafeCommand, newUnsafeCommand, newUnsafeSection;
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
				case 'unsafeSections':
					if (operation === "remove")
						unsafeSections = [...unsafeSections.filter(item => item !== thing)];
					else if (operation === "add")
						if (!unsafeSections.includes(thing))
							unsafeSections = [...unsafeSections,thing];
					break;
			}
		newUnsafeCommand = ""
		newSafeCommand = ""
		newUnsafeSection = ""
	}

	const filterBackup = () => {
		let out = "# STARTING PROCESS ";
		backup = editor.getValue();
		if (backup.length === 0)
			snackTest = "Nothing to analyze"
		else {
			let backupRows = backup.split('\n')
			let weAreInUnSafeSection = false;
			for (let row of backupRows)
			{
				row = row.toLowerCase().trim().replace("set ","");
				if (!weAreInUnSafeSection)
				{
					if (unsafeSections.some(command => row.startsWith(command)))
						weAreInUnSafeSection = true;
				}
				else {
					if (otherSectionsAndSectionsEnder.some(command => row.startsWith(command)))
						if (!unsafeSections.some(command => row.startsWith(command)))
							weAreInUnSafeSection = false;
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

					if (safe !== false && !weAreInUnSafeSection)
						safe = true;
					if ((safe || safe === null) && !weAreInUnSafeSection)
						out = out + "\n" + row + (safe ? (!row.startsWith('#') ?" #SAFE" :"") : " #TO_CHECK")
					else if (!safe || weAreInUnSafeSection)
						out+= "\n" + (!row.startsWith('#') ? ("# " + row + " #UNSAFE" + (weAreInUnSafeSection ? "_SECTION":"" )  + " !!") : row)
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

<svelte:head>
	<title>Betaflight 4.3 safe Migrator - from @deduzzo -</title>
</svelte:head>
<MaterialApp>
	<Snackbar class="flex-column" bind:active={snackbar} bottom center timeout={2000}>
		{snackTest}
	</Snackbar>
	<div class="pa-4">
		<div class="d-flex justify-center ma-5"><h3>Betaflight 4.3 CLI Migrator v.0.1</h3></div>
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
						<span class="text-overline">SAFE COMMANDS</span>
					</div>
					<CardText>
							{#each safeCommands as safeCommand (safeCommand)}
								<Chip label="{safeCommand}" on:close={() => addRemoveInArray('safe', safeCommand,'remove') } close size="small" class="ma-2 green-text">{safeCommand}</Chip>
							{/each}
					</CardText>
					<CardActions>
						<TextField bind:value={newSafeCommand} on:keypress={(ev) => {if (ev.code === 'Enter') addRemoveInArray('safe', newSafeCommand,'add'); } } placeholder="Add Safe command" />
						<Button on:click={() => addRemoveInArray('safe', newSafeCommand,'add') } rounded outlined>Add</Button>
					</CardActions>
				</Card>
				<Card class="d-flex ma-5" outlined>
					<div class="pl-4 pr-4 pt-3">
						<span class="text-overline red">UNSAFE COMMANDS</span>
					</div>
					<CardText>
						{#each unsafeCommands as unsafeCommand (unsafeCommand)}
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
						<span class="text-overline red">UNSAFE SECTIONS</span>
					</div>
					<CardText>
						{#each unsafeSections as unsafeSection (unsafeSection)}
							<Chip on:close={() => addRemoveInArray('unsafeSections', unsafeSection,'remove') } close size="small" class="ma-2 green-text">{unsafeSection}</Chip>
						{/each}
					</CardText>
					<CardActions>
						<TextField bind:value={newUnsafeSection} on:keypress={(ev) => {if (ev.code === 'Enter') addRemoveInArray('unsafeSections', newUnsafeSection,'add'); } } placeholder="Add Safe command" />
						<Button on:click={() => addRemoveInArray('unsafeSections', newUnsafeSection,'add') } rounded outlined>Add</Button>
					</CardActions>
				</Card>
			</CardText>
		</Card>
		<div class="d-flex justify-center ma-5" style="font-size: 12px">DISCLAIMER: with the use of this tool everyone is required to MANUAL verification of the result produced. Given the variety of quads and flight controllers it is possible that the results produced are not 100% perfect. This tool gives an indication, and is to be considered as a work in progress. The creators DO NOT assume any responsibility for any malfunction, product damage or problem that may occur after its use.</div>
		<div class="d-flex justify-center ma-5">Source on: <a href="https://github.com/deduzzo/betaflight43-safe-migration"> Github @deduzzo</a> </div>
	</div>
</MaterialApp>

<style>
	:global(.editor) {
		font-size: 0.8rem;
		width: 800px;
	}
</style>
