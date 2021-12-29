<script>
    import {Button, Chip, Card, CardActions, CardText, TextField, Snackbar} from 'svelte-materialify';
    import { safeCommands, unsafeCommands, unsafeSections, allValues} from './stores'
    export let type = "";

    let _newCommand;
    let _cssClass;
    let  _values, _allValues;
    let _caption;
    let _store;
    let _snackbar= false;
    let _snackText;

    allValues.subscribe(value => {
        _allValues = value;
    });

    switch (type) {
        case 'safeCommands':
            _cssClass = "light-green text-lighten-5 green-text"
            _caption = "SAFE Command";
            _store = safeCommands;
            safeCommands.subscribe(value => {
                _values = value;
            });
            break;
        case 'unsafeCommands':
            _cssClass = "red yellow-text"
            _caption = "UNSAFE Command";
            _store = unsafeCommands;
            unsafeCommands.subscribe(value => {
                _values = value;
            });
            break;
        case 'unsafeSections':
            _cssClass = "red yellow-text"
            _caption = "UNSAFE Section";
            _store = unsafeSections;
            unsafeSections.subscribe(value => {
                _values = value;
            });
            break;
    }

    const _addRemoveInArray = (op, item) =>
    {
        if (_newCommand !== "" || op === "remove") {
            if (op === "remove")
                _store.update(val => val.filter(it => it !== item));
            else if (op === "add")
                if (!_allValues.includes(_newCommand))
                    _store.update(val => [...val, item]);
                else
                {
                    _snackText = "Command already present, please delete it before adding them";
                    _snackbar = true;
                }
        }
        _newCommand = ""
    }
</script>

<Card class="d-flex ma-2" outlined shaped>
    <div class="pl-4 pr-4 pt-3">
        <span class="text-h6 {_cssClass}">{ _caption }</span>
    </div>
    <CardText>
        {#each _values.sort() as command (_caption + command)}
            <Chip label="{command}" on:close={() => _addRemoveInArray('remove',command) } close size="large" class="ma-2 {_cssClass} font-weight-bold">{command}</Chip>
        {/each}
    </CardText>
    <CardActions>
        <TextField bind:value={_newCommand} on:keypress={(ev) => {if (ev.code === 'Enter') _addRemoveInArray('add',_newCommand); } } placeholder="add to {_caption}" />
        <Button on:click={() => _addRemoveInArray('add',_newCommand) } rounded outlined>Add</Button>
    </CardActions>
    <Snackbar class="flex-column" bind:active={_snackbar} bottom center timeout={2000}>
        {_snackText}
    </Snackbar>
</Card>