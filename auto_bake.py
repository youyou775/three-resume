import bpy

# ...existing code...

if __name__ == "__main__" or DEV_MODE:
    services = create_services()
    output_dir = r"C:\MyFiles\Work\HomeProjects\3dGameWebsite\three-resume\public"
    def get_scene_setting(name, default):
        return getattr(bpy.context.scene, name, default)

    settings = {
        "deicimate": get_scene_setting("decimate", True),
        "unwrap": get_scene_setting("unwrap", True),
        "bake": get_scene_setting("bake", True),
        "save": get_scene_setting("save", True),
        "compress": get_scene_setting("compress", True),
        "export": get_scene_setting("export", True),
    }
    workflow = AutoBakeWorkflow(services, output_dir, settings)

    # Define your hooks
    def pre_hook(collection):
        print(f"[PRE] About to process collection: {collection.name}")

    def post_hook(collection):
        print(f"[POST] Finished processing collection: {collection.name}")

    # To bake all scenes with hooks:
    # workflow.bake_all_scenes(process_all=True, deicimate=True, unwrap=True, bake=True, save=True, compress=True, export=True, pre_hook=pre_hook, post_hook=post_hook)

    # Or, to bake only the current scene with hooks:
    workflow.bake_collections(
        bpy.context.scene,
        process_all=True,
        deicimate=settings["deicimate"],
        unwrap=settings["unwrap"],
        bake=settings["bake"],
        save=settings["save"],
        compress=settings["compress"],
        export=settings["export"],
        pre_hook=pre_hook,
        post_hook=post_hook
    )