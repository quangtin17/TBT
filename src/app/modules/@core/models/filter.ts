export class Filter {
    term?: string;
    type?: string;
    story_type?: Array<any>;
    country?: Array<any>;
    activity?: Array<any>;
    tag?: Array<any>;
    page_size?: number;
    constructor(type: string) {
        this.type = type;
    }

}
