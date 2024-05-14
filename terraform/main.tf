provider "aws" {
  region = "us-east-1"
}

# Data source to check if the Elastic Beanstalk application already exists
data "aws_elastic_beanstalk_application" "existing" {
  name = "champions-club-application"
}

# Conditional creation of the Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "myapp" {
  count = can(data.aws_elastic_beanstalk_application.existing.id) ? 0 : 1

  name        = "champions-club-application"
  description = "Champions Club Nest.js Application"

  lifecycle {
    prevent_destroy = true
  }
}

# Elastic Beanstalk environment, using the application name from either the new or existing application
resource "aws_elastic_beanstalk_environment" "myenv" {
  name                = "ChampionsClub-env"
  application         = length(aws_elastic_beanstalk_application.myapp) > 0 ? aws_elastic_beanstalk_application.myapp[0].name : data.aws_elastic_beanstalk_application.existing.name
  solution_stack_name = "64bit Amazon Linux 2023 v6.1.4 running Node.js 20"
  wait_for_ready_timeout = "30m"  // increase from '20m' to '30m'
  depends_on = [aws_elastic_beanstalk_application.myapp]

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "Port"
    value     = "8080"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "3"
  }
}
