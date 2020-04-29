module.exports = function warriorMaster(mod) {
    let cid,
    enabled = true,
    failsafe = 0,
    w = 0,
    loc = {
        "x": 0,
        "y": 0,
        "z": 0
    };

    const retaliate = {
        "reserved": 0,
        "npc": false,
        "type": 1,
        "huntingZoneId": 0,
        "id": 131000
    };

    const command = mod.command;

    command.add('retaliate', {
        $none() {
            enabled = !enabled;
            command.message(`${enabled ? "enabled" : "disabled"}`);
        }
    });

    mod.hook('S_LOGIN', mod.majorPatchVersion >= 81 ? 14 : 13, (event) => {
        cid = event.gameId;
    });

    mod.hook("C_PLAYER_LOCATION", 5, (event) => {
		if (enabled) {
			loc = event.loc;
			w = event.w;
		}
	});

    mod.hook('S_EACH_SKILL_RESULT', 14, (event) => {
        if(enabled){
            if(event.target === cid){
                if(event.reaction.enable == true){
                    failsafe = 0;
                    setTimeout(function () { useRetaliate(); }, 700);
                    
                }
            }
        }
    });

    function useRetaliate(){
        if(failsafe < 25){
            failsafe++;
            mod.toServer('C_START_SKILL', 7, {
                skill: retaliate,
				w: w,
				loc: loc,
				//dest: dest, 
				unk: false,
				moving: false,
				continue: false,
				//target: 0n,
				unk2: false
            });
            setTimeout(function () { useRetaliate(); }, 50);
        }
    }
}   