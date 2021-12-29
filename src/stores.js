import {derived, writable} from 'svelte/store';

export const unsafeCommands= writable(['acc', 'dterm', 'dyn', 'ff', 'gyro',  'rc'])
export const safeCommands = writable(['aux','beacon', 'blackbox','batch','board','debug_mode', 'dshot', 'beeper','feature' ,'led', 'map', 'max_check','min_check','osd','sbus'
    ,'serial', 'idle_min_rpm', 'manufacturer' ,'name','resource', 'small_angle','vtx','vtxtable','yaw_motors_reversed','save'])
export const unsafeSections= writable(['rateprofile'])

export const allValues = derived(
    [safeCommands, unsafeCommands, unsafeSections],
    ([$safeCommands, $unsafeCommands, $unsafeSections]) => { return [...$safeCommands, ...$unsafeSections, ...$unsafeCommands] },[]);