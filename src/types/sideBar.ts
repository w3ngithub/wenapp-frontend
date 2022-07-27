export default interface sidebarItemsInterface {
	name: string;
	url: string;
	isExpandable: boolean;
	id: any;
	subItems?: {
		name: string;
		url: string;
		id: any;
	}[];
}
