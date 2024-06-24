import fs from "fs";
import type {ContractPromise} from "@polkadot/api-contract";
import {handleEventReturn} from "@prosopo/typechain-types";

export function getTypeDescription(id: number | string, types: any): any {
	return types[id];
}

export function getEventTypeDescription(name: string, types: any): any {
	return types[name];
}

export function decodeEvents(events: any[], contract: ContractPromise, types: any): any[] {
	return events.filter((record: any) => {
		const { event } = record;

		const [address, data] = record.event.data;

		return event.method == 'ContractEmitted' && address.toString() === contract.address.toString();
	}).map((record: any) => {

		const {args, event} = contract.abi.decodeEvent(record);

		const _event: Record < string, any > = {};

		for (let i = 0; i < args.length; i++) {
			_event[event.args[i]!.name] = args[i]!.toJSON();
		}

		// extract event identifier (ContractName::MethodName::EventName -> EventName)
		
		const splittedEvent = event.identifier.toString().split("::");
		const length = splittedEvent.length;
		const name = splittedEvent[length - 1] ?? event.identifier.toString();

		handleEventReturn(_event, getEventTypeDescription(name, types));

		return {
			name: event.identifier.toString(),
			args: _event,
		};
	});
}
