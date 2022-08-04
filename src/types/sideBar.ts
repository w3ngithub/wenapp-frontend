export default interface sidebarItemsInterface {
	iconName: string;
	key: string,
	label:string,
	name: string;
	url: string;
	isExpandable: boolean;
	id: any;
	subItems?: {
		label:string;
		key:string;
		name: string;
		url: string;
		id: any;
	}[];
}
