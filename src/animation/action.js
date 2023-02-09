export default class Action {
    onStart = () => {};
    onUpdate = p => {};
    onStop = () => {};
    isStarted = false;
    isStopped = false;
    from = 0;
    to = 1;
    
    /**
     * merge an action with another
     * these two actions should have the same start time and stop time
     */
    merge(action) {
        const out = new Action();
        
        out.onStart = () => {
            this.onStart();
            action.onStart();
        };
        out.onUpdate = p => {
            this.onUpdate(p);
            action.onUpdate(p);
        };
        out.onStop = () => {
            this.onStop();
            action.onStop();
        };
        
        return out;
    }
    
    run(start, stop, now) {
        if (this.isStarted && !this.isStopped) {
            if (now > stop) {
                this.onUpdate(this.to);
                this.onStop();
                this.isStopped = true;
            } else {
                this.onUpdate((now - start)/(stop - start) * (this.to - this.from));
            }
        } else if (now > start) {
            this.onStart();
            this.onUpdate(this.from);
            this.isStarted = true;
        }
    }
}