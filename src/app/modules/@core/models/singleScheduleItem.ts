export class SingleScheduleItem {
  constructor(
    public type: string,
    public description: string,
    public icon: string,
    public icon_description: string,

    public related_stories: []
  ) {}
}
