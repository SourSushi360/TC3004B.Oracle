{
  inputs = {
    mvn2nix.url = "github:fzakaria/mvn2nix";
    utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/1e5b653dff12029333a6546c11e108ede13052eb";
  };

  outputs = {
    self,
    nixpkgs,
    mvn2nix,
    utils,
    ...
  }: utils.lib.eachSystem utils.lib.defaultSystems (system: let
    pkgs = import nixpkgs {
     inherit system; 
     overlays = [mvn2nix.overlay];
    };
    selfPkgs = self.packages.${system};
    dockerImage = pkgs.dockerTools.streamLayeredImage {
      name = "ghcr.io/435vic/todoapp";
      tag = self.rev or self.dirtyRev or self.lastModified;

      contents = with pkgs; [ cacert iana-etc ];

      extraCommands = ''
        mkdir -m 1777 tmp
      '';

      config = {
        Cmd = [ "${selfPkgs.todoapp}/bin/${selfPkgs.todoapp.pname}" ];
      };
    };
  in {
    packages = rec {
      todoapp-frontend = pkgs.callPackage ./MtdrSpring/front/package.nix {}; 
      todoapp = pkgs.callPackage ./MtdrSpring/backend/package.nix { inherit todoapp-frontend; };
      nodePkgs = import ./globalNodeEnv/default.nix {
        inherit system;
        pkgs = pkgs;
        nodejs = pkgs.nodejs_22;
      };

      claude-code = nodePkgs."@anthropic-ai/claude-code" // {
        meta.mainProgram = "claude";
      };
    };

    apps = { 
      docker = {
        type = "app";
        program = "${dockerImage}";
      };
    };

    devShells = {
      backend = pkgs.mkShell {
        packages = [
          selfPkgs.nodePkgs.gh-actions-language-server
        ];
        inputsFrom = [ selfPkgs.todoapp ];
      };
    };
    
    defaultPackage = selfPkgs.todoapp;
  }); 
}
