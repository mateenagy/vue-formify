type EventHandler = (data?: any) => void;

class EventEmitter {
	private eventListeners: Record<string, EventHandler[]> = {};

	on(eventName: string, handler: EventHandler): void {
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = [];
		}

		this.eventListeners[eventName].push(handler);
	}

	off(eventName: string, handler: EventHandler): void {
		const listeners = this.eventListeners[eventName];

		if (listeners) {
			this.eventListeners[eventName] = listeners.filter(h => h !== handler);
		}
	}

	emit(eventName: string, data?: any): void {
		const listeners = this.eventListeners[eventName];

		if (listeners) {
			listeners.forEach(handler => handler(data));
		}
	}
}

export default EventEmitter;

// // Example usage:

// const eventEmitter = new CustomEventEmitter();

// // Subscribe to an event
// const handleEvent = (data: any) => {
// 	console.log(`Event received with data: ${data}`);
// };

// eventEmitter.on('customEvent', handleEvent);

// // Dispatch an event
// eventEmitter.emit('customEvent', 'Hello, custom event!');

// // Unsubscribe from the event
// eventEmitter.off('customEvent', handleEvent);

// // This event handler will not be called anymore
// eventEmitter.emit('customEvent', 'This should not be logged');
