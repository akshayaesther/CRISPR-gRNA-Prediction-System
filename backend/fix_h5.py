import h5py
import json

filename = "crispr_activity_model.h5"
try:
    with h5py.File(filename, "r+") as f:
        model_config_raw = f.attrs.get("model_config")
        if model_config_raw is not None:
            if isinstance(model_config_raw, bytes):
                model_config_str = model_config_raw.decode("utf-8")
            else:
                model_config_str = model_config_raw
            model_config = json.loads(model_config_str)
            
            def fix_dtypes(obj):
                if isinstance(obj, dict):
                    # Strip Keras 3 specifics
                    if "quantization_config" in obj:
                        del obj["quantization_config"]
                    
                    # Convert dicts into strings and continue recursion
                    keys = list(obj.keys())
                    for k in keys:
                        v = obj[k]
                        if k == "dtype" and isinstance(v, dict) and v.get("class_name") == "DTypePolicy":
                            obj[k] = v.get("config", {}).get("name", "float32")
                        else:
                            fix_dtypes(v)
                elif isinstance(obj, list):
                    for item in obj:
                        fix_dtypes(item)
            
            fix_dtypes(model_config)
            
            # Fix layers
            if "config" in model_config and "layers" in model_config["config"]:
                for layer in model_config["config"]["layers"]:
                    if layer["class_name"] == "InputLayer":
                        if "batch_shape" in layer["config"]:
                            layer["config"]["batch_input_shape"] = layer["config"].pop("batch_shape")
                        if "optional" in layer["config"]:
                            del layer["config"]["optional"]
            
            f.attrs["model_config"] = json.dumps(model_config).encode("utf-8")
            print("Successfully fixed Keras 3 metadata for Keras 2 runtime!")
        else:
            print("No model_config found in HDF5 attributes.")
except Exception as e:
    print(f"Error modifying h5 file: {e}")
