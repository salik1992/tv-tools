import { ns } from '../logger';

const logger = ns('EventListener');

export interface IEventListener<
	Events extends { [key: string]: Events[keyof Events] },
> {
	/**
	 * Adds listener to an event.
	 * @param name - name of the event to listen to
	 * @param listener - function that is trigered by the event
	 */
	addEventListener<E extends keyof Events>(
		name: E,
		listener: (payload: Events[E]) => void,
	): void;
	/**
	 * Removes listener of the event.
	 * @param name - name of the event to stop listening to
	 * @param listener - listener to remove
	 */
	removeEventListener<E extends keyof Events>(
		name: E,
		listener: (payload: Events[E]) => void,
	): void;
}

export class EventListener<
	Events extends { [key: string]: Events[keyof Events] },
> implements IEventListener<Events>
{
	/**
	 * Listeners
	 */
	protected listeners: Partial<{
		[key in keyof Events]: Set<(payload: Events[key]) => void>;
	}> = {};

	/**
	 * Adds listener to an event.
	 * @param name - name of the event to listen to
	 * @param listener - function that is trigered by the event
	 */
	public addEventListener = <E extends keyof Events>(
		name: E,
		listener: (payload: Events[E]) => void,
	): void => {
		if (!this.listeners[name]) {
			this.listeners[name] = new Set();
		}
		const listeners = this.listeners[name]!;
		if (!listeners.has(listener)) {
			listeners.add(listener);
		}
	};

	/**
	 * Adds listener to an event.
	 * @param name - name of the event to listen to
	 * @param listener - function that is trigered by the event
	 */
	public removeEventListener = <E extends keyof Events>(
		name: E,
		listener: (payload: Events[E]) => void,
	) => {
		const listeners = this.listeners[name];
		if (!listeners) {
			return;
		}
		listeners.delete(listener);
	};

	/**
	 * Trigres the event and passes the payload to listeners.
	 * @param name - name of the event to trigger
	 * @param payload - payload that is passed to listeners
	 */
	public triggerEvent<
		E extends keyof Events,
		P extends Events[E] & undefined,
	>(name: E, payload?: P): void;
	public triggerEvent<
		E extends keyof Events,
		P extends NonNullable<Events[E]> | null,
	>(name: E, payload: P): void;
	public triggerEvent<E extends keyof Events, P extends Events[E]>(
		name: E,
		payload: P,
	): void {
		const listeners = this.listeners[name];
		if (!listeners) {
			return;
		}
		listeners.forEach((listener) => {
			setTimeout(() => {
				try {
					listener(payload);
				} catch (e) {
					logger.error(e);
				}
			}, 0);
		});
	}
}
